import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { getUser } from "@/lib/dal";
import EditProfileForm from "@/components/ui/EditProfileForm";

const Page = async () => {
  const authenticatedUserData = await getUser();

  // Parse the data before passing it to the client component
  const parsedAuthenticatedUserData = JSON.parse(
    JSON.stringify(authenticatedUserData)
  );

  const user = parsedAuthenticatedUserData || {};

  return (
    <div className="bg-black-100 py-8 px-4 lg:py-10 h-screen md:flex md:items-center md:justify-center md:flex-col w-full">
      <div className="w-full md:w-1/2 lg:w-[40%] xl:w-[30%] 2xl:w-[25%]">
        <div className="mb-6 md:mb-10 lg:mb-12 flex flex-col gap-4">
          <Link
            href="/account/overview"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%]  flex items-center justify-center"
            aria-label="Back to account overview"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl">Edit profile</h1>
        </div>
        <EditProfileForm user={user} />
      </div>
    </div>
  );
};

export default Page;
