import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ** to register user **
// get user details from frontend
// validation - not empty
// check if user already exists: username, email
// check for images, check for avatar in local storage
// check if avatar uploaded or not
// upload into cloudinary
// create user object - create entry in DB
// remove password & refresh token field from response
// check for user creation
// return response

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullName, email, userName, password } = req.body;
  console.log("email: ", email);

  // validation - if any of the field is empty or not
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username, email
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });
  console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  // saving avatar & coverImages into localpath if it's there, based on multer middleware
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // checking if avatar is uploaded or not
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  // upload into cloudinary, await until the upload is done
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // checking again if avatar is uploaded or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  // create user object - create entry in DB
  const user = await User.create({
    fullName,
    avatar: avatar.url, //only url will be save into DB
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  // if the user  is found, remove password & refreshToken field
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Checking if the user is created or not
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user!");
  }

  // Sending the response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully!"));
});

export { registerUser };
