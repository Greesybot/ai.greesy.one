import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  customerEmail: string;
  productId: string;
  orderId: string;
  status: "pending" | "completed" | "failed";
  amount: number;
  currency: string;
  createdAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema({
  customerEmail: { type: String, required: true },
  productId: { type: String, required: true },
  orderId: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "TL" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
