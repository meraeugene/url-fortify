"use client";

import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import EditProfileForm from "@/components/EditProfileForm";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";
import { Skeleton } from "@/components/ui/Skeleton";
import { RiErrorWarningLine } from "react-icons/ri";

const Page = () => {
  const { data: user, error, isLoading } = useSWR("/api/user", fetcher);

  if (error) {
    return (
      <div className=" h-screen flex flex-col items-center justify-center text-center font-medium   ">
        <div className="border-red-500 border rounded-sm  text-red-500 py-2 px-4 text-xl flex items-center justify-center gap-2">
          <RiErrorWarningLine />
          <p>{error.response.data.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="bg-black-100 py-8 px-4 h-screen md:flex md:items-center md:justify-center md:flex-col w-full ">
        <div className="w-full md:w-1/2 lg:w-[40%] xl:w-[30%] 2xl:w-[25%]">
          <Skeleton className="bg-black-200 h-6 mb-6 md:h-8 rounded-none w-[15%]" />
          <Skeleton className="bg-black-300 h-6 mb-6 md:mb-10 lg:mb-12 rounded-none w-1/2" />

          <Skeleton className="bg-black-200 rounded-sm h-[85px] border-slate-800 w-full" />

          <Skeleton className="bg-black-300 h-4 mt-6 rounded-none w-1/3" />
          <Skeleton className="bg-black-200 h-8 mt-6 rounded-none w-full" />

          <Skeleton className="bg-black-300 h-4 mt-6 rounded-none w-1/3" />
          <Skeleton className="bg-black-200 h-8 mt-6 rounded-none w-full" />

          <Skeleton className="bg-black-300 h-10 mt-6 rounded-none w-full" />
        </div>
      </div>
    );

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
