"use client";

import { FiEdit2 } from "react-icons/fi";
import { IoDiamondOutline, IoArrowBack } from "react-icons/io5";
import {
  MdOutlinePayments,
  MdOutlineDataUsage,
  MdOutlineNavigateNext,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { GiVibratingShield } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/helpers/fetcher";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RiRefundLine } from "react-icons/ri";

const sections = [
  {
    title: "Account",
    links: [
      { href: "/account/profile", label: "Edit profile", icon: <FiEdit2 /> },
      { href: "/account/usage", label: "Usage", icon: <MdOutlineDataUsage /> },
    ],
  },
  {
    title: "Subscription",
    links: [
      {
        href: "/available-plans",
        label: "Available plans",
        icon: <IoDiamondOutline />,
      },
      {
        href: "/account/manage-your-plan",
        label: "Manage your subscription",
        icon: <GiVibratingShield />,
      },
      {
        href: "/account/refund",
        label: "Refund subscription",
        icon: <RiRefundLine />,
      },
    ],
  },
  {
    title: "Payment",
    links: [
      {
        href: "/account/order-history",
        label: "Order history",
        icon: <MdOutlinePayments />,
      },
    ],
  },
  {
    title: "Help",
    links: [
      {
        href: "/url-fortify-support",
        label: "URL-Fortify support",
        icon: <BiSupport />,
      },
    ],
  },
];

const Page = () => {
  // const [isFetching, setIsFetching] = useState(true);

  const { data: user, isLoading } = useSWR("/api/user", fetcher, {
    revalidateIfStale: true,
    refreshInterval: 1000,
  });

  // useEffect(() => {
  //   const fetchLatestData = async () => {
  //     setIsFetching(true);
  //     await mutate("/api/user");
  //     setIsFetching(false);
  //   };

  //   fetchLatestData();
  // }, []);

  const array = new Array(6).fill(null);

  if (isLoading)
    return (
      <div className="bg-black-100 py-8 px-4">
        <div className=" md:max-w-xl  lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[35vw] md:mx-auto md:justify-center md:items-center ">
          <Skeleton className="bg-black-300 h-6 md:h-8 md:w-[10%] mb-6 rounded-none w-[15%]" />
          <Skeleton className="bg-black-300 h-6 mb-6 rounded-none w-1/2" />
          <div className="grid grid-cols-1 gap-4 w-full">
            {array.map((_, index) => (
              <Skeleton
                key={index}
                className="text-white rounded-md pt-4 h-32 pb-6 px-4 bg-black-200 border-slate-800 border w-full"
              >
                <Skeleton className="bg-black-300 h-6 mb-6 rounded-none" />
                <Skeleton className="bg-black-300 h-4 mb-3 rounded-none" />
                <Skeleton className="bg-black-300 h-4 rounded-none" />
              </Skeleton>
            ))}
          </div>
        </div>
      </div>
    );

  const subscriptionPlan = user?.subscription?.currentPlan?.title;

  // Filter sections based on subscription plan
  const filteredSections = sections.map((section) => {
    if (section.title === "Subscription") {
      return {
        ...section,
        links: section.links.filter(
          (link) =>
            subscriptionPlan !== "Fortify Free" ||
            link.label === "Available plans" ||
            link.label === "Manage your subscription"
        ),
      };
    }
    return section;
  });

  return (
    <div className=" bg-black-100 py-8 px-4 lg:py-10 h-full">
      <div className="md:max-w-xl lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[35vw] mx-auto">
        <div className="mb-8 flex flex-col gap-4">
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%] flex items-center justify-center"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl">Account Overview</h1>
        </div>

        <div className="flex bg-black-200 items-center justify-between text-white rounded-md p-4 border-slate-800 pr-0 border w-full">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Your plan</h2>
            <h1 className="font-bold text-2xl text-[#00ED82]">
              {subscriptionPlan}
            </h1>
          </div>
          <Image
            width={70}
            height={70}
            src="/url-fortify-logo.png"
            alt="logo"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 w-full mt-4">
          {filteredSections.map((section, index) => (
            <div
              key={index}
              className="text-white rounded-md pb-3 bg-black-200 border-slate-800 border w-full"
            >
              <div className="flex items-center justify-between p-3 px-4">
                <h2 className="font-bold text-xl">{section.title}</h2>
              </div>
              {section.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="content flex items-center justify-between py-3 px-4 hover:bg-gray-900 transition-all duration-300 ease-in-out"
                >
                  <div className="flex gap-3 items-center">
                    <div className="bg-gray-700 p-2 rounded-sm">
                      {link.icon}
                    </div>
                    <h1>{link.label}</h1>
                  </div>
                  <MdOutlineNavigateNext fontSize={24} />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
