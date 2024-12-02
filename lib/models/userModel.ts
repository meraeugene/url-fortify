import { Schema, model, models, Document, Types } from "mongoose";

// Define interfaces for Subscription and UsageStats
export interface Subscription {
  currentPlan: Types.ObjectId | null; // No plan by default
  planStartDate?: Date; // Only set when a plan is subscribed
  planEndDate?: Date; // Only set when a plan is subscribed
  status: "inactive" | "active" | "expired" | "cancelled"; // Default to inactive for new users
}

export interface UsageStats {
  monthlyLookupsUsed: number;
  lastResetDate: Date; // Track when the lookups were last reset
}

export interface User extends Document {
  email: string;
  image: string;
  fullName?: string;
  role: "user" | "admin";
  subscription: Subscription;
  usageStats: UsageStats;
}

const UserSchema = new Schema<User>({
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
    planStartDate: {
      type: Date, // No default value
    },
    planEndDate: {
      type: Date, // No default value
      validate: {
        validator: function (this: User, value: Date) {
          // Validate only if planStartDate exists
          return this.subscription.planStartDate
            ? value > this.subscription.planStartDate
            : true;
        },
        message: "Plan end date must be greater than the start date.",
      },
    },
    status: {
      type: String,
      enum: ["inactive", "active", "expired", "cancelled"],
      default: "inactive", // Default to inactive for new users
    },
  },
  usageStats: {
    monthlyLookupsUsed: {
      type: Number,
      default: 0,
    },
    lastResetDate: {
      type: Date,
      default: new Date(), // Track when limits were last reset
    },
  },
});

const User = models?.User || model<User>("User", UserSchema);

export default User;
