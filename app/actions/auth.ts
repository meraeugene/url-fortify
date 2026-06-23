import { createSession, deleteSession } from "@/lib/session";
import { connect } from "@/lib/db";
import User from "@/lib/models/userModel";
import { UserData } from "@/types";
import { FREE_PLAN_ID } from "@/lib/subscriptionPlans";

export const login = async (userData: UserData) => {
  const { fullName, email, image } = userData;

  // Ensure all required fields (full name, email, and profile image) are provided
  if (!fullName || !email || !image) {
    throw new Error(
      "All required fields (Full name, email, and profile image) must be provided."
    );
  }
  // Connect to the database
  await connect();

  // Search for an existing user by email
  let user = await User.findOne({ email });

  // If the user does not exist, create a new user
  if (!user) {
    user = new User({
      fullName,
      email,
      image,
      subscription: {
        currentPlan: FREE_PLAN_ID,
        status: "active",
      },
    });
    await user.save();
  }

  await createSession(user._id);
};

export const logout = async () => {
  await deleteSession();
};
