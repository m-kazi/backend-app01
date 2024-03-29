import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //file system from nodejs

// from .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// file upload might give u problem, best practice to use try-catch
/* will create a method, local path will be given into the param, if successful, unlink the file in the local storage */

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // to upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded
    console.log("File has been uploaded successfully!", response.url);
    fs.unlinkSync(localFilePath);

    // console.log("Local file has been removed successfully!");

    return response;
  } catch (error) {
    // remove the loacaly saved temp file when upload fails
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
