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
  // console.log("email: ", email);

  // validation - if any of the field is empty or not
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  // console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }
  console.log(req.files);

  // saving avatar & coverImages into localpath if it's there, based on multer middleware

  // saving avatar into local path
  const avatarLocalPath = req.files?.avatar[0]?.path;

  // checking if coverImage is onlocal path or not
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // checking if avatar is on local path otherwise throw error
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload into cloudinary, await until the upload is done
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // checking if avatar is uploaded or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is needed!");
  }

  // create user object - create entry in DB
  const user = await User.create({
    fullName,
    email,
    password,
    userName: userName.toLowerCase(),
    avatar: avatar.url, //only url will be save into DB
    coverImage: coverImage?.url || "",
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
