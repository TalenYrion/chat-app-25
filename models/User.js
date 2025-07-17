import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      toLowwercase: true,
    },
    password: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
