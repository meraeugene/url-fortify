"use client";
import React from "react";
import { pricings } from "@/data";
import { InteractiveDiv } from "./ui/MovingBorders";
import useGeoLocationService from "@/hooks/useGeoLocation";
import { formattedPrice } from "@/helpers/pricingUtils";
import MiniLoader from "./MiniLoader";
import MagicButton from "./MagicButton";

const Pricings = () => {
  const { country, loading } = useGeoLocationService();

  return (
    <section id="pricings" className="pt-24 md:pt-44 pb-20 w-full">
      <h1 className="heading">
        Our <span className="text-[#00ED82]">Pricings</span>
      </h1>

      <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {pricings.map((card) => (
          <InteractiveDiv
            key={card.id}
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
              borderRadius: `calc(1.75rem * 0.96)`,
            }}
            className="flex-1 text-white border-slate-800"
            otherClasses="w-full"
          >
            <div className="flex flex-col text-start w-full   p-5 gap-8">
              <div>
                <h1 className=" mb-2 text-xl md:text-2xl font-bold">
                  {card.title}
                </h1>

                <div className="price__container  text-xl md:text-2xl font-bold">
                  {loading ? (
                    // Show loading spinner when data is loading
                    <div className="flex items-center justify-center my-4">
                      <MiniLoader />
                    </div>
                  ) : country ? (
                    // Once loading is done and country is available, display the price and yearly price
                    <div className="text-[#00ED82] flex items-center gap-1 ">
                      <h1 className="text-4xl font-bold">
                        {formattedPrice(country, card.price)}
                      </h1>
                      <span className=" text-sm font-medium">/</span>
                      <span className=" text-sm font-medium ">month</span>
                    </div>
                  ) : // <h1 className="text-sm text-gray-200">Loading...</h1>
                  null}
                </div>

                <p className="text-start text-base text-white-100 mt-3 font-normal">
                  {card.desc}
                </p>

                <div className="w-full h-[1px] my-4 bg-[#252f3f]" />

                <ul className="list-disc ml-5 flex flex-col gap-3">
                  {card.features.map((feature, index) => (
                    <li className="text-base text-white-100 " key={index}>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 mb-3 w-full">
                  {card.title !== "Free Plan" && (
                    <MagicButton title={`Get ${card.title}`} position="right" />
                  )}
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
