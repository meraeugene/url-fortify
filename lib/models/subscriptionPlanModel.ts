import { Schema, model, models, Document } from "mongoose";

// Define an interface for the Pricing Plan schema
interface Feature {
  name: string;
  value: string | number | boolean;
}

interface SubscriptionPlan extends Document {
  title: string;
  monthlyLookups: number; // Max scans per month for this plan
  features: Feature[];
  price: number; // Stored in cents for accuracy
}

const SubscriptionPlanSchema = new Schema<SubscriptionPlan>({
  title: {
    type: String,
    required: true,
  },
  monthlyLookups: {
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
  model<SubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;
