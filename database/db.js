import mongoose from "mongoose";

const connecteToDB = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("successfully connected to database");
  } catch (err) {
    console.log(err.message);
  }
};

export default connecteToDB;
