import { Schema, model, models, Document } from "mongoose";

// Define an interface for the Pricing Plan schema
interface Feature {
  name: string;
  value: string | number | boolean;
}

interface ISubscriptionPlan extends Document {
  title: string;
  intendedUsers: string;
  maxLookups: number; // Max scans per month for this plan
  features: Feature[];
  price: number; // Stored in cents for accuracy
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  title: {
    type: String,
    required: true,
  },
  intendedUsers: {
    type: String,
    required: true,
  },
  maxLookups: {
    type: Number,
    required: true,
  },
  features: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: Schema.Types.Mixed, // Allows flexibility (e.g., number, string, boolean)
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value >= 0,
      message: "Price must be a non-negative number.",
    },
  },
});

const SubscriptionPlan =
  models?.SubscriptionPlan ||
  model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;
