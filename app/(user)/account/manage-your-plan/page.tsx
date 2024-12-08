"use client";

import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import MiniLoader from "@/components/MiniLoader";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";
import MagicButton from "@/components/MagicButton";
import { PlanFeature } from "@/types";
import Image from "next/image";
import { RiErrorWarningLine } from "react-icons/ri";

const Page = () => {
  const { data: user, error, isLoading } = useSWR("/api/user", fetcher);

  if (error) {
    return (
      <div className=" h-screen flex flex-col items-center justify-center text-center  font-medium   ">
        <div className="border-red-500 border rounded-sm  text-red-500 py-2 px-4 text-xl flex items-center justify-center gap-2">
          <RiErrorWarningLine />
          <p>{error.response.data.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <MiniLoader />;

  const { currentPlan } = user.subscription;

  return (
    <div className="bg-black-100 px-4 py-8 md:p-0  pb-12 md:pb-14  h-full md:max-w-[70vw] lg:max-w-[50vw] xl:max-w-[40vw] 2xl:max-w-[30vw] md:flex md:flex-col md:items-center md:justify-center md:h-screen mx-auto  ">
      <div className="mb-8 flex flex-col gap-4 w-full">
        <Link
          href="/account/overview"
          className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%] flex items-center justify-center"
        >
          <IoArrowBack />
        </Link>
        <h1 className="font-bold text-2xl">Manage your subscription</h1>
      </div>

      <div className="plan-details__container w-full">
        <div
          style={{
            background: "rgb(4,7,29)",
            backgroundColor:
              "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
          }}
          className="flex-1 text-white border-slate-800 border rounded-sm "
        >
          <div className="flex flex-col text-start w-full gap-8">
            <div>
              <div className="text-green-400 flex items-center justify-between bg-gray-900 bg-opacity-40 backdrop-blur-lg backdrop-filter py-2 pr-0 text-xl md:text-2xl px-5 font-bold ">
                <h1>{currentPlan.title}</h1>

                <Image
                  width={70}
                  height={70}
                  src="/url-fortify-logo.png"
                  alt="logo"
                />
              </div>

              <ul className="list-disc py-5 px-5 ml-5 flex flex-col gap-3">
                {currentPlan.features.map((feature: PlanFeature) => (
                  <li className="text-base text-white-100 " key={feature._id}>
                    {feature.value} {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {currentPlan.title === "Fortify Free" && (
          <div className="mt-7 ">
            <Link href={`/available-plans`}>
              <MagicButton title="Upgrade plan" position="right" />
            </Link>
          </div>
        )}

        {currentPlan.title === "Standard Plan" && (
          <div className="flex flex-col md:flex-row items-center gap-4 mt-7">
            <div className="w-full">
              <Link href={`/available-plans`}>
                <MagicButton title="Upgrade plan" position="right" />
              </Link>
            </div>

            <div className="w-full">
              <Link href={`/account/refund`}>
                <MagicButton title="Request refund" position="right" />
              </Link>
            </div>
          </div>
        )}

        {currentPlan.title === "Professional Plan" && (
          <div className="flex flex-col md:flex-row items-center gap-4 mt-7">
            <div className="w-full">
              <Link href={`/available-plans`}>
                <MagicButton title="Change plan" position="right" />
              </Link>
            </div>

            <div className="w-full">
              <Link href={`/account/refund`}>
                <MagicButton title="Request refund" position="right" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
