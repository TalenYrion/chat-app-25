import mongoose from "mongoose";

const UserInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    imageId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserInfo", UserInfoSchema);

//  username: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
