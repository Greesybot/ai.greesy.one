import mongoose, { Schema } from "mongoose";

interface UserSchema {
  email: string;
  avatar: string;
  credits: number;
  limits: {
    left: number;
    total: number;
  };
  premium: boolean;
  beta: string;
  ip: string;
  creation: string;
  apiKey: string;
}

const userDataSchema = new Schema<UserSchema>({
  email: { type: String, required: true },
  avatar: { type: String },
  credits: { type: Number },
  apiKey: { type: String },
  limits: {
    left: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },

  premium: { type: Boolean, default: false },
  beta: { type: String },
  ip: { type: String },
  creation: { type: String },
});

const UserModel =
  mongoose.models.User || mongoose.model<UserSchema>("User", userDataSchema);

export default UserModel;
