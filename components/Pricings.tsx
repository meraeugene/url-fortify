"use client";
import { InteractiveDiv } from "./ui/MovingBorders";
import MagicButton from "./MagicButton";
import { useToast } from "@/hooks/useToast";
import { Plan, PlanFeature } from "@/types";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";
import MiniLoader from "@/components/MiniLoader";
import { AuthenticatedUserData } from "@/types";
import { convertToSubcurrency } from "@/helpers/convertToSubcurrency";
import { useRouter } from "next/navigation";
import { BiSupport } from "react-icons/bi";
import { generateUUIDInvoiceNumber } from "@/helpers/generateUUIDInvoiceNumber";

type PricingsProps = {
  isAuth: boolean;
  authenticatedUserData: AuthenticatedUserData;
};

const Pricings = ({ isAuth, authenticatedUserData }: PricingsProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const {
    data: subscriptionPlans,
    error,
    isLoading,
  } = useSWR("/api/subscription-plans", fetcher);

  const user = authenticatedUserData || {};

  if (isLoading) return <MiniLoader />;

  const handleCheckoutSubscription = async (plan: Plan) => {
    if (!isAuth) {
      toast({
        description: "Please log in first to proceed with purchasing.",
        variant: "destructive",
      });
      return;
    }

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
    <section id="pricings" className="pt-24 md:pt-44 pb-20 w-full">
      <h1 className="heading mb-14">
        Our <span className="text-[#00ED82]">Pricings</span>
      </h1>

      <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {subscriptionPlans.map((plan: Plan) => (
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
    </section>
  );
};

export default Pricings;
