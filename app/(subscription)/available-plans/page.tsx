"use client";

import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { InteractiveDiv } from "@/components/ui/MovingBorders";
import MagicButton from "@/components/MagicButton";
import { Plan, PlanFeature } from "@/types";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";
import MiniLoader from "@/components/MiniLoader";
import { convertToSubcurrency } from "@/helpers/convertToSubcurrency";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateUUIDInvoiceNumber } from "@/helpers/generateUUIDInvoiceNumber";
import { BiSupport } from "react-icons/bi";
import { RiErrorWarningLine } from "react-icons/ri";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const {
    data: subscriptionPlan,
    error,
    isLoading,
  } = useSWR("/api/subscription-plans", fetcher);

  const {
    data: user,
    error: errorProfile,
    isLoading: loadingProfile,
  } = useSWR("/api/user", fetcher);

  if (error || errorProfile) {
    return (
      <div className=" h-screen flex flex-col items-center justify-center text-center  font-medium   ">
        <div className="border-red-500 border rounded-sm  text-red-500 py-2 px-4 text-xl flex items-center justify-center gap-2">
          <RiErrorWarningLine />
          <p>{error.response.data.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading || loadingProfile) return <MiniLoader />;

  const filteredSubscriptionPlans = subscriptionPlan.filter(
    (plan: Plan) => plan.title !== "Fortify Free"
  );

  const handleCheckoutSubscription = async (plan: Plan) => {
    const planId = plan._id;

    try {
      setLoadingStates((prev) => ({ ...prev, [planId]: true }));

      const payload = {
        amount: convertToSubcurrency(plan.price),
        description: plan.intendedUsers,
        name: plan.title,
        planId,
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        invoiceNumber: generateUUIDInvoiceNumber(),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to process checkout.");
      }

      const responseData = await response.json();

      router.push(responseData.checkout_url);
    } catch (error: any) {
      console.log(error);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [planId]: false }));
    }
  };

  return (
    <div className="bg-black-100 py-8  px-4 lg:py-10 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:items-center md:max-w-[60vw] lg:max-w-[85vw] xl:max-w-[60vw] 2xl:max-w-[50vw] mx-auto   ">
      <div className="w-full">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/account/overview"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] lg:w-[8%]   flex items-center justify-center"
            aria-label="Back to account overview"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl">Available plans</h1>
        </div>

        <div className="w-full  grid grid-cols-1 lg:grid-cols-2  gap-10">
          {filteredSubscriptionPlans.map((plan: Plan) => (
            <InteractiveDiv
              key={plan._id}
              duration={Math.floor(Math.random() * 10000) + 10000}
              borderRadius="1.75rem"
              style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                  "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
                borderRadius: `calc(1.75rem * 0.96)`,
              }}
              className="flex-1 w-full  text-white border-slate-800 "
              otherClasses="w-full h-full "
            >
              <div className="flex flex-col text-start w-full gap-8">
                <div>
                  {plan.title === "Standard Plan" ? (
                    <div
                      style={{
                        borderTopLeftRadius: `calc(1.75rem * 0.96)`,
                        borderTopRightRadius: `calc(1.75rem * 0.96)`,
                      }}
                      className="p-2 bg-green-300 text-black-100 font-bold text-2xl border text-center border-slate-800"
                    >
                      <h1>Recommended</h1>
                    </div>
                  ) : plan.title === "Fortify Free" ? (
                    <div
                      style={{
                        borderTopLeftRadius: `calc(1.75rem * 0.96)`,
                        borderTopRightRadius: `calc(1.75rem * 0.96)`,
                      }}
                      className="p-2 bg-green-100 text-black-100 font-bold text-2xl border text-center border-slate-800"
                    >
                      <h1>Basic</h1>
                    </div>
                  ) : plan.title === "Professional Plan" ? (
                    <div
                      style={{
                        borderTopLeftRadius: `calc(1.75rem * 0.96)`,
                        borderTopRightRadius: `calc(1.75rem * 0.96)`,
                      }}
                      className="p-2 bg-green-200 text-black-100 font-bold text-2xl border text-center border-slate-800"
                    >
                      <h1>Advanced</h1>
                    </div>
                  ) : null}

                  <div className="px-5 pr-0  pt-6 pb-8">
                    <div className="flex flex-col lg:flex-row  gap-3  mb-3 items-start justify-between">
                      <h1 className=" text-xl md:text-2xl font-bold">
                        {plan.title}
                      </h1>

                      {plan.title === "Standard Plan" && (
                        <div className="text-sm text-center font-bold flex items-center justify-center lg:rounded-br-none lg:rounded-tr-none   border border-slate-800 bg-green-300 text-black-100 py-2 px-2 rounded-lg ">
                          <h1>+30 Free URL Scans</h1>
                        </div>
                      )}

                      {plan.title === "Professional Plan" && (
                        <div className="text-sm text-center font-bold flex items-center justify-center lg:rounded-br-none lg:rounded-tr-none   border border-slate-800 bg-green-200 text-black-100 py-2 px-2 rounded-lg ">
                          <div className="flex items-center gap-2">
                            <BiSupport />
                            <h1> Priority Support</h1>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="price__container  text-xl md:text-2xl font-bold">
                      <h1 className="text-4xl text-green-400 font-bold">
                        ₱{plan.price}
                      </h1>
                    </div>

                    <p className="text-start text-base text-white-100 mt-3 font-normal">
                      {plan.intendedUsers}
                    </p>

                    <div className="w-full h-[1px] my-4 bg-[#252f3f]" />

                    <ul className="list-disc ml-5 pr-3 flex flex-col gap-3">
                      {plan.features.map((feature: PlanFeature) => (
                        <li
                          className="text-base text-white-100 "
                          key={feature._id}
                        >
                          {plan.title === "Standard Plan" &&
                          typeof feature.value === "number"
                            ? feature.value - 30
                            : feature.value}{" "}
                          {feature.name}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 pr-5 w-full">
                      {plan.title !== "Fortify Free" && (
                        <div onClick={() => handleCheckoutSubscription(plan)}>
                          <MagicButton
                            title={
                              String(plan._id) ===
                              String(user.subscription?.currentPlan?._id) ? (
                                "Current Plan"
                              ) : loadingStates[plan._id] ? (
                                <MiniLoader />
                              ) : (
                                `Get ${plan.title}`
                              )
                            }
                            position="right"
                            disabled={
                              String(plan._id) ===
                                String(user.subscription?.currentPlan?._id) ||
                              loadingStates[plan._id]
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </InteractiveDiv>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
