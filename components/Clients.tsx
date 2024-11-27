"use client";

import React from "react";

import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";
import Image from "next/image";

const Clients = () => {
  return (
    <section id="reviews" className="py-20">
      <h1 className="heading">
        Kind words from
        <span className="text-[#00ED82]"> satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10 lg:mt-14">
        <div
          // remove bg-white dark:bg-black dark:bg-grid-white/[0.05], h-[40rem] to 30rem , md:h-[30rem] are for the responsive design
          className=" rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-16 mt-24">
          {companies.map((company) => (
            <React.Fragment key={company.id}>
              <div className="flex items-center gap-2">
                <Image
                  src={company.img}
                  alt={company.name}
                  width={30}
                  height={30}
                  className="md:w-8 lg:w-10 w-5"
                />
                <h1 className="font-bold 2xl:text-lg tracking-wider text-blue-300">
                  {company.name}
                </h1>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
