import { asyncHandler } from "../utils/asyncHandler.js";

// to register user
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "kazzcode",
  });
});

export { registerUser };
