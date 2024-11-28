import React from "react";
import { getUser } from "@/lib/dal";
import { FiEdit2 } from "react-icons/fi";
import {
  IoDiamondOutline,
  IoCloseOutline,
  IoPricetagOutline,
  IoArrowBack,
} from "react-icons/io5";
import {
  MdOutlinePayments,
  MdOutlineDataUsage,
  MdOutlineNavigateNext,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  // Retrieve the user data from Zustand store
  // const userData = useUserStore((state) => state.userData);

  // No need to parse data because it's already server component
  const authenticatedUserData = await getUser();
  const { user } = authenticatedUserData || {};

  const sections = [
    {
      title: "Account",
      links: [
        { href: "/account/profile", label: "Edit profile", icon: <FiEdit2 /> },
        {
          href: "/account/usage",
          label: "Usage",
          icon: <MdOutlineDataUsage />,
        },
      ],
    },
    {
      title: "Subscription",
      links: [
        {
          href: "/available-plans",
          label: "Available Plans",
          icon: <IoDiamondOutline />,
        },
        {
          href: "/account/cancel",
          label: "Cancel Subscription",
          icon: <IoCloseOutline />,
        },
      ],
    },
    {
      title: "Payment",
      links: [
        {
          href: "/account/order-history",
          label: "Order History",
          icon: <MdOutlinePayments />,
        },
        {
          href: "/redeem",
          label: "Redeem",
          icon: <IoPricetagOutline />,
        },
      ],
    },
    {
      title: "Help",
      links: [
        {
          href: "/url-fortify-support",
          label: "URL-Fortify Support",
          icon: <BiSupport />,
        },
      ],
    },
  ];

  return (
    <div className="bg-black-100 py-8 px-4 lg:py-10">
      <div className=" md:max-w-xl lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[35vw]  mx-auto">
        <div className=" mb-8 flex flex-col gap-4 ">
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%] flex items-center justify-center"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl ">Account Overview</h1>
        </div>
        <div className=" flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="flex bg-black-200 items-center justify-between text-white rounded-md p-4 border-slate-800 border w-full">
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">Your plan</h2>
                <h1 className="font-bold text-2xl text-[#00ED82]">
                  URL-Fortify Free
                </h1>
              </div>

              <Image
                width={70}
                height={70}
                src="/url-fortify-logo.png"
                alt="logo"
              />
            </div>

            {sections.map((section, index) => (
              <div
                key={index}
                className="text-white rounded-md pb-3 bg-black-200 border-slate-800 border w-full"
              >
                <div className="flex items-center justify-between p-3 px-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-xl">{section.title}</h2>
                  </div>
                </div>

                {section.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="content flex items-center justify-between py-3 px-4  hover:bg-gray-900 transition-all duration-300 ease-in-out"
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
    </div>
  );
};

export default page;
