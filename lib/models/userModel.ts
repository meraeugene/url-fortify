import { Schema, model, models, Document, Types } from "mongoose";

// Define interfaces for Subscription and UsageStats
export interface Subscription {
  currentPlan: Types.ObjectId | null; // No plan by default
  status: "inactive" | "active" | "refunded"; // Default to inactive for new users
  paymentId: string | null; // Payment ID for the current subscription
  paymentMethod: string | null;
  paidAt: number | null;
  invoiceNumber: string | null;
}

export interface UsageStats {
  maxLookupsUsed: number;
  lastURLScanDate: Date;
}

export interface Payments {
  userId: Types.ObjectId; // Reference to User
  paymentId: string; // Unique payment ID (from a payment gateway)
  invoiceNumber: string; // Invoice number for the payment
  paymentMethod: string; // Payment method (e.g., gcash, paymaya)
  paidAt: number; // Date when the payment was made
  amount: number; // Total amount paid
  planId: Types.ObjectId; // Reference to the Plan
}

export interface IUser extends Document {
  email: string;
  image: string;
  fullName?: string;
  role: "user" | "admin";
  subscription: Subscription;
  payments: Payments;
  usageStats: UsageStats;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format.",
    },
  },
  image: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  subscription: {
    currentPlan: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      default: null, // Default to no subscription
    },
    status: {
      type: String,
      enum: ["inactive", "active", "refunded"],
      default: "inactive", // Default to inactive for new users
    },
  },
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  usageStats: {
    maxLookupsUsed: {
      type: Number,
      default: 0,
    },
    lastURLScanDate: {
      type: Date,
    },
  },
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
