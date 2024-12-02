import { createSession, deleteSession } from "@/lib/session";
import { connect } from "@/lib/db";
import User from "@/lib/models/userModel";
import { UserData } from "@/types";
import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";

export async function login(userData: UserData) {
  const { fullName, email, image } = userData;

  // Ensure all required fields (full name, email, and profile image) are provided
  if (!fullName || !email || !image) {
    throw new Error(
      "All required fields (Full name, email, and profile image) must be provided."
    );
  }
  // Connect to the database
  await connect();

  // Try to find the 'Free Plan' from the PricingPlan collection
  const freePlan = await SubscriptionPlan.findOne({ title: "Free Plan" });

  // If the 'Free Plan' doesn't exist, throw an error
  if (!freePlan) {
    throw new Error("Free plan not found.");
  }

  // Search for an existing user by email
  let user = await User.findOne({ email });

  // If the user does not exist, create a new user
  if (!user) {
    user = new User({
      fullName,
      email,
      image,
      subscription: {
        currentPlan: freePlan._id,
        status: "active",
      },
    });
    await user.save();
  }

  await createSession(user._id);
}

export async function logout() {
  await deleteSession();
}
