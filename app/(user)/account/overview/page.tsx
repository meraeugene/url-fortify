import React from "react";
import { getUser } from "@/lib/dal";

const page = async () => {
  // Retrieve the user data from Zustand store
  // const userData = useUserStore((state) => state.userData);

  // No need to parse data because it's already server component
  const authenticatedUserData = await getUser();
  const { user } = authenticatedUserData || {};

  console.log(user);
  return <div>account overview page</div>;
};

export default page;
