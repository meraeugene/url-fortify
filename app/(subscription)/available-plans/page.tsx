"use client";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { pricingPlans } from "@/data";
import { InteractiveDiv } from "@/components/ui/MovingBorders";
import useGeoLocationService from "@/hooks/useGeoLocation";
import { formattedPrice } from "@/helpers/pricingUtils";
import MagicButton from "@/components/MagicButton";
import Image from "next/image";

const Page = () => {
  const { country, loading } = useGeoLocationService();

  const filteredSubscriptionPlans = pricingPlans.filter(
    (plan) => plan.title !== "Free Plan"
  );

  return (
    <div className="bg-black-100 py-8 px-4 lg:py-10 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-center ">
      <div className=" md:max-w-xl  lg:max-w-[85vw] xl:max-w-[60vw]  mx-auto">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/account/usage"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%] lg:w-[8%]   flex items-center justify-center"
            aria-label="Back to account overview"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl">Available plans</h1>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2  gap-10">
          {filteredSubscriptionPlans.map((pricingPlan) => (
            <InteractiveDiv
              key={pricingPlan.id}
              duration={Math.floor(Math.random() * 10000) + 10000}
              borderRadius="1.75rem"
              style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                  "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
                borderRadius: `calc(1.75rem * 0.96)`,
              }}
              className="flex-1 w-full text-white border-slate-800 "
              otherClasses="w-full "
            >
              <div className="flex flex-col text-start w-full    p-5 gap-8">
                <div>
                  <h1 className=" mb-2 text-xl md:text-2xl font-bold">
                    {pricingPlan.title}
                  </h1>

                  <div className="price__container  text-xl md:text-2xl font-bold">
                    {loading ? (
                      // Show loading spinner when data is loading
                      <Image
                        src="/loader.svg"
                        width={30}
                        height={30}
                        alt="loader"
                      />
                    ) : country ? (
                      // Once loading is done and country is available, display the price and yearly price
                      <div className="text-[#00ED82] flex items-center gap-1 ">
                        <h1 className="text-4xl font-bold">
                          {formattedPrice(country, pricingPlan.price)}
                        </h1>
                        <span className=" text-sm font-medium">/</span>
                        <span className=" text-sm font-medium ">month</span>
                      </div>
                    ) : // <h1 className="text-sm text-gray-200">Loading...</h1>
                    null}
                  </div>

                  <p className="text-start text-base text-white-100 mt-3 font-normal">
                    {pricingPlan.desc}
                  </p>

                  <div className="w-full h-[1px] my-4 bg-[#252f3f]" />

                  <ul className="list-disc ml-5 flex flex-col gap-3">
                    {pricingPlan.features.map((feature, index) => (
                      <li className="text-base text-white-100 " key={index}>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 mb-3 w-full">
                    {pricingPlan.title !== "Free Plan" && (
                      <Link
                        href={`/purchase/offer/${pricingPlan.offer}/?country=${country}`}
                      >
                        <MagicButton
                          title={`Get ${pricingPlan.title}`}
                          position="right"
                        />
                      </Link>
                    )}
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
