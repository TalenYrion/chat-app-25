import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserInfo from "../models/UserInfo.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkuser = await User.findOne({ $or: [{ email }, { username }] });
    if (checkuser) {
      return res.status(409).json({
        success: false,
        message: "user already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "user is resgister successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const checkuser = await User.findOne({ username });
    if (!checkuser) {
      return res.status(409).json({
        success: false,
        message: "user user is not registered",
      });
    }

    const checkPassword = await bcrypt.compare(password, checkuser.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: checkuser._id,
        username,
        email: checkuser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true if your frontend is served over HTTPS
      sameSite: "None", // Allows cross-site cookie
    });

    res.status(200).json({
      success: true,
      message: "user is logged in successfully",
      id: checkuser._id,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const verifyUserInfo = async (req, res) => {
  try {
    const { id } = req.body;

    const userInfo = await UserInfo.findOne({ userId: id });
    if (!userInfo) {
      return res.status(400).json({
        success: false,
        message: "user does not have user info",
      });
    }
    res.status(200).json({
      success: true,
      message: "user has user info",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const LogOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // set to false if you're not using HTTPS
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
