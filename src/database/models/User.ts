import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = model("User", UserSchema, "users");

export default User;
