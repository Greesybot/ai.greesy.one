import mongoose, { Schema, Document } from "mongoose";

interface LimitsSchema {
  left: number;
  total: number;
  lastRequest: Date;
}

interface UserSchema extends Document {
  email: string;
  avatar: string;
  credits: number;
  limits: LimitsSchema;  // `limits` should be an object, not an array
  premium: boolean;
  beta: string;
  ip: string;
  creation: string;
  apiKey: string;
}

// Define the limits sub-schema as an object
const limitsSchema = new Schema<LimitsSchema>({
  left: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  lastRequest: { type: Date, default: Date.now },
});

// Define the main user schema and reference limitsSchema as an object
const userDataSchema = new Schema<UserSchema>({
  email: { type: String, required: true },
  avatar: { type: String },
  credits: { type: Number },
  apiKey: { type: String },
  limits: { type: limitsSchema, default: () => ({}) },  // Use an object, not an array
  premium: { type: Boolean, default: false },
  beta: { type: String },
  ip: { type: String },
  creation: { type: String },
});

// Model creation
const UserModel = mongoose.models.User || mongoose.model<UserSchema>("User", userDataSchema);

export default UserModel;