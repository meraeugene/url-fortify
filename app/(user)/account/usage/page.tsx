import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { getUser } from "@/lib/dal";
import UsageChart from "@/components/UsageChart";
import MagicButton from "@/components/MagicButton";
import { PlanFeature } from "@/types";

const page = async () => {
  const authenticatedUserData = await getUser();

  // Parse the data before passing it to the client component
  const parsedAuthenticatedUserData = JSON.parse(
    JSON.stringify(authenticatedUserData)
  );

  const user = parsedAuthenticatedUserData || {};

  // Safely access subscription and usage data
  const subscription = user.subscription || {};
  const usageStats = user.usageStats || {};
  const currentPlan = subscription.currentPlan || {
    title: "Free Plan",
    features: [],
    monthlyLookups: 0,
  };

  return (
    <div className="bg-black-100 py-8 px-4 lg:py-10 ">
      <div className=" md:max-w-xl flex flex-col gap-10  lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[35vw]  mx-auto">
        <div className="plan-usage__container">
          <div className=" mb-6 flex flex-col gap-4 ">
            <Link
              href="/account/overview"
              className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%] flex items-center justify-center"
            >
              <IoArrowBack />
            </Link>
            <h1 className="font-bold text-2xl ">Plan usage</h1>
          </div>

          <UsageChart user={user} />
        </div>

        <div className="plan-details__container">
          <h1 className="font-bold text-2xl  mb-6 ">Your plan details</h1>

          <div
            style={{
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
            }}
            className="flex-1 text-white border-slate-800 border rounded-sm lg:w-1/2"
          >
            <div className="flex flex-col text-start w-full   py-5 gap-8">
              <div>
                <h1 className="text-[#00ED82]  mb-2 text-xl md:text-2xl px-5 font-bold">
                  {currentPlan.title}
                </h1>

                <div className="w-full h-[1px] my-4 bg-[#252f3f]" />

                <ul className="list-disc px-5 ml-5 flex flex-col gap-3">
                  {currentPlan.features.map((feature: PlanFeature) => (
                    <li className="text-base text-white-100 " key={feature._id}>
                      {feature.value} {feature.name}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 mb-3 px-5">
                  {/* Check if the user has reached the maximum usage limit */}
                  {
                    usageStats.monthlyLookupsUsed >=
                    currentPlan.monthlyLookups ? (
                      <p className="text-red-500 text-sm mb-6">
                        You have reached your usage limit! <br /> Please upgrade
                        your plan for more lookups.
                      </p>
                    ) : /* If usage is nearing 80% of the limit, show a warning message */
                    usageStats.monthlyLookupsUsed /
                        currentPlan.monthlyLookups >=
                      0.8 ? (
                      <p className="text-yellow-300 text-sm mb-6">
                        You are approaching your usage limit! <br /> Consider
                        upgrading your plan for more lookups.
                      </p>
                    ) : null /* If neither condition is met, do not show any message */
                  }

                  {/* Provide a button for upgrading the plan */}
                  <Link href={`/available-plans`}>
                    <MagicButton title="Upgrade Plan" position="right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
