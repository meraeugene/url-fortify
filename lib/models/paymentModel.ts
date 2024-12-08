import { Schema, model, models, Document, Types } from "mongoose";

// Define an interface for Payment
interface IPayment extends Document {
  userId: Types.ObjectId; // Reference to User
  paymentId: string; // Unique payment ID (from a payment gateway)
  invoiceNumber: string; // Invoice number for the payment
  paymentMethod: string; // Payment method (e.g., gcash, paymaya)
  paidAt: number; // Date when the payment was made
  amount: number; // Total amount paid
  status: "paid" | "refunded" | "failed"; // Status (paid, refunded, failed)
  plan: Types.ObjectId; // Reference to the Plan
}

// Define the Payment Schema
const paymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paidAt: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["paid", "refunded", "failed"],
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
    required: true,
  },
});

// Create the Payment model
const Payment = models?.Payment || model<IPayment>("Payment", paymentSchema);

export default Payment;
