import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
      ref: "PricingPlan",
    },
    planStartDate: {
      type: Date,
      default: Date.now,
    },
    planEndDate: {
      type: Date,
    },
  },
  usageStats: {
    dailyLookupsUsed: {
      type: Number,
      default: 0,
    },
    monthlyLookupsUsed: {
      type: Number,
      default: 0,
    },
  },
});

const User = models?.User || model("User", UserSchema);

export default User;
