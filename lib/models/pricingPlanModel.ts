import { Schema, model, models } from "mongoose";

const PricingPlanSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dailyLookups: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const PricingPlan =
  models?.PricingPlan || model("PricingPlan", PricingPlanSchema);

export default PricingPlan;
