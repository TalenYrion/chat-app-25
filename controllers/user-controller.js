import UserInfo from "../models/UserInfo.js";

export const userList = async (req, res) => {
  try {
    const userId = req.user.id;

    const userList = await UserInfo.find({ userId: { $ne: userId } }).populate(
      "userId",
      "username"
    );

    if (userList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User list found",
      userList,
    });
  } catch (err) {
    console.log("Error in userList controller:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const oneUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserInfo.findOne({ userId: userId }).populate(
      "userId",
      "username"
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user,
    });
  } catch (err) {
    console.log("Error in user controller:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
