import UserInfo from "../models/UserInfo.js";
import uploadToCloudniary from "../helper/upload-cloudinary.js";
import cloudinary from "../config/cloudinary.js";
import imageMiddleware from "../middleware/image-middleware.js";

export const CreateUser = async (req, res) => {
  try {
    const { bio } = req.body;
    const filePath = req.file;

    let imageUrl =
      "https://res.cloudinary.com/dkstruibg/image/upload/v1751649536/ug69lkwsxic8ahziaaba.png"; // default placeholder
    let imageId = null;

    // If a file was uploaded, replace default image
    if (filePath) {
      const uploadResult = await uploadToCloudniary(filePath.buffer);
      imageUrl = uploadResult.imageUrl;
      imageId = uploadResult.imageId;
    }

    const newUser = new UserInfo({
      userId: req.user?.id,
      imageUrl,
      imageId,
      bio,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User successfully created",
      newUser,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const EditPic = async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.user?.id;
    const filePath = req.file;

    const userInfo = await UserInfo.findOne({ userId }); // ✅ FIXED: findOne takes an object, not a raw ID
    if (!userInfo) {
      return res.status(401).json({
        // ✅ Added `return` to stop execution
        success: false,
        message: "user not found",
      });
    }

    // Delete old image from Cloudinary if exists
    if (userInfo.imageId) {
      await cloudinary.uploader.destroy(userInfo.imageId);
    }

    // Upload new image
    let imageUrl, imageId;
    if (filePath) {
      const uploadResult = await uploadToCloudniary(filePath.buffer);
      imageUrl = uploadResult.imageUrl;
      imageId = uploadResult.imageId;
    }

    // Prepare update data
    const updateData = {};
    if (filePath) {
      updateData.imageUrl = imageUrl;
      updateData.imageId = imageId;
    }
    if (bio !== undefined) updateData.bio = bio;

    await UserInfo.updateOne({ userId }, { $set: updateData });

    res.status(200).json({
      message: "updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
