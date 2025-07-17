import UserInfo from "../models/UserInfo.js";
import uploadToCloudniary from "../helper/upload-cloudinary.js";

export const CreateUser = async (req, res) => {
  try {
    const { bio } = req.body;
    const filePath = req.file?.path;

    let imageUrl =
      "https://res.cloudinary.com/dkstruibg/image/upload/v1751649536/ug69lkwsxic8ahziaaba.png"; // default placeholder
    let imageId = null;

    // If a file was uploaded, replace default image
    if (filePath) {
      const uploadResult = await uploadToCloudniary(filePath);
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
