"use client";

import { IoArrowBack, IoInformationCircleOutline } from "react-icons/io5";
import Link from "next/link";
import OrderHistoryTable from "@/components/OrderHistoryTable";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";
import MiniLoader from "@/components/MiniLoader";
import { RiErrorWarningLine } from "react-icons/ri";

const Page = () => {
  const { data, error, isLoading } = useSWR("/api/user/order-history", fetcher);

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

  if (isLoading) return <MiniLoader />;

  const { payments } = data || {};

  return (
    <div className="bg-black-100 py-8 px-4 lg:py-10 h-screen">
      <div className=" md:max-w-xl  lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[50vw]  mx-auto">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/account/overview"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%] lg:w-[8%]  flex items-center justify-center"
            aria-label="Back to account overview"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl">Order history</h1>
        </div>

        {payments?.length > 0 ? (
          <OrderHistoryTable payments={payments} />
        ) : (
          <div className="bg-gray-800 px-4 py-3 rounded-sm flex items-center gap-3">
            <IoInformationCircleOutline fontSize={28} />
            <h1>You have no payments or refunds.</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
