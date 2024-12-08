"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/helpers/fetcher";
import MiniLoader from "@/components/MiniLoader";
import { IoCopyOutline } from "react-icons/io5";
import { formatPaymentMethod } from "@/helpers/formatPaymentMethod";
import { PlanFeature } from "@/types";
import { formatDate } from "@/helpers/formatDate";
import { IoLockClosedSharp } from "react-icons/io5";
import { useToast } from "@/hooks/useToast";
import { formatPrice } from "@/helpers/formatPrice";
import { useParams } from "next/navigation";
import { RiErrorWarningLine } from "react-icons/ri";

const Page = () => {
  const params = useParams<{ invoiceNumber: string }>();

  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(true);

  // Fetch the payment details based on the invoiceNumber
  const { data, error, isLoading } = useSWR(
    `/api/user/payment/?invoiceNumber=${params.invoiceNumber}`, // API request using the invoiceNumber
    fetcher,
    {
      revalidateIfStale: true,
    }
  );

  useEffect(() => {
    const fetchLatestData = async () => {
      setIsFetching(true);
      await mutate(`/api/user/payment/?invoiceNumber=${params.invoiceNumber}`);
      setIsFetching(false);
    };

    fetchLatestData();
  }, [params.invoiceNumber]);

  if (isFetching || isLoading) return <MiniLoader />;

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

  const { invoiceNumber, paidAt, paymentMethod, amount } = data || {};
  const { features, title } = data?.plan || {};

  const formattedDate = paidAt ? formatDate(paidAt) : "Date not available";

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceNumber || "");
    toast({
      title: "Copied",
    });
  };

  return (
    <div className="py-8 pb-20 md:max-w-[70vw] md:py-12 lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[30vw] mx-auto px-6  text-white">
      <Link
        href="/account/order-history"
        className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[12%] flex items-center justify-center"
        aria-label="Back to account overview"
      >
        <IoArrowBack />
      </Link>

      {/* Header Section */}
      <header className="text-center mt-4 flex items-center justify-center gap-4 flex-col mb-10">
        <IoShieldCheckmark fontSize={50} color="#4ADE80" />

        <h1 className="text-green-400 text-4xl font-bold ">
          Payment <br /> Successful
        </h1>
      </header>

      {/* Glossy Card Section */}
      <section className="w-full bg-gray-900 bg-opacity-40 backdrop-blur-lg backdrop-filter   shadow-lg border-slate-800 border rounded-sm ">
        <div className="card__details">
          <div
            style={{
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
            }}
            className="flex-1 rounded-sm rounded-br-none rounded-bl-none"
          >
            <div className="text-green-400 flex items-center justify-between bg-gray-900 bg-opacity-40 backdrop-blur-lg backdrop-filter py-2 text-xl md:text-2xl px-5 pr-0 font-bold ">
              <h1>{title}</h1>

              <Image
                width={70}
                height={70}
                src="/url-fortify-logo.png"
                alt="logo"
              />
            </div>

            <ul className="list-disc  py-5 px-5 ml-5 flex flex-col gap-3">
              {features?.map((feature: PlanFeature) => (
                <li className="text-base text-white-100 " key={feature._id}>
                  {feature.value} {feature.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 flex flex-col gap-2">
            {/* Merchant Details */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-base">Merchant</h2>
              <p className="text-gray-400 ">URL-Fortify</p>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-base">Payment Method</h2>
              <p className="text-gray-400  ">
                {formatPaymentMethod(paymentMethod)}
              </p>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm  lg:text-base">Total Amount</h2>
              <p className="text-green-400 ">{formatPrice(amount)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* INVOICE SECTION */}
      <section className="mt-12 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold mb-6">Invoice Detail</h1>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-400">Invoice Number</h2>
            <p className="text-lg text-green-400">{invoiceNumber}</p>
          </div>
          <button
            onClick={handleCopy}
            className="bg-gray-700 text-white rounded-full p-3 cursor-pointer hover:bg-gray-600 transition-all"
          >
            <IoCopyOutline />
          </button>
        </div>

        <div className="flex items-center justify-between my-6">
          <div>
            <h2 className="font-semibold text-gray-400 text-sm lg:text-base">
              Payment Date
            </h2>
            <p className="text-sm lg:text-base">{formattedDate}</p>
          </div>
          <div className="flex items-end flex-col text-right">
            <h2 className="font-semibold text-gray-400 text-sm lg:text-base">
              Item
            </h2>
            <p className="text-sm lg:text-base">{title}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h2 className="font-semibold text-sm text-gray-400 lg:text-base">
              Entity
            </h2>
            <h2 className="font-semibold text-sm text-gray-400 lg:text-base">
              Amount
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-400 text-sm lg:text-base">
              Taxable Value
            </h2>
            <p className="text-base lg:text-lg">{formatPrice(amount)}</p>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-400 text-sm lg:text-base">
              Tax Rate
            </h2>
            <p className="text-base lg:text-lg">0.0%</p>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-400 text-sm lg:text-base">
              Tax Amount
            </h2>
            <p className="text-base lg:text-lg">₱0</p>
          </div>

          <div className="flex items-center justify-between border-dashed border-y py-4 mt-4">
            <h2 className="font-semibold text-gray-400 text-sm lg:text-base">
              Total Paid
            </h2>
            <p className="text-base text-green-400 font-bold lg:text-lg">
              {formatPrice(amount)}
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-8 gap-2 text-sm flex items-center justify-center lg:text-base">
        <IoLockClosedSharp /> Your information is safely secured
      </footer>
    </div>
  );
};

export default Page;
