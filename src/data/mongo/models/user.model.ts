import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    enum: ["ADMIN_ROLE", "USER_ROLE"],
    default: ["USER_ROLE"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
export const UserModel = mongoose.model("User", userSchema);
