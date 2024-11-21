import { bgGreen, bgRed } from "colorette";
import { connect } from "./lib/db";

// Data
import { pricings } from "./data/index";

// Models
import PricingPlan from "./lib/models/pricingPlanModel";

// Function to connect to the database and seed data
const importData = async () => {
  await connect();
  try {
    // Clear existing pricing data
    await PricingPlan.deleteMany({});
    console.log("Cleared existing pricing plans");

    // Insert the pricing data into the collection
    await PricingPlan.insertMany(pricings);
    console.log("Pricing plans seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

const destroyData = async () => {
  try {
    await PricingPlan.deleteMany();

    console.log(bgRed("Data Destroyed"));
    process.exit();
  } catch (error) {
    console.log(bgRed(`${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
