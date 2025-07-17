import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "your-folder-name", // optional: specify folder
      },
      (error, result) => {
        if (error) {
          console.error(error);
          reject(new Error("Error uploading to Cloudinary"));
        } else {
          resolve({
            imageUrl: result.secure_url,
            imageId: result.public_id,
          });
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default uploadToCloudinary;
