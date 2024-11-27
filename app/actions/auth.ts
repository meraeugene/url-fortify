import { createSession, deleteSession } from "@/lib/session";
import { connect } from "@/lib/db";
import User from "@/lib/models/userModel";
import { UserData } from "@/types";

export async function login(userData: UserData) {
  const { fullName, email, image } = userData;

  if (!fullName || !email || !image) {
    throw new Error(
      "All required fields (Full name, email, and profile image) must be provided."
    );
  }

  await connect();

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ fullName, email, image });
    await user.save();
  }

  await createSession(user._id);
}

export async function logout() {
  await deleteSession();
}
