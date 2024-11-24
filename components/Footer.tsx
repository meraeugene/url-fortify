import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <Image
          src="/footer-grid.svg"
          width={500}
          height={500}
          alt="grid"
          className="w-full h-full opacity-50 "
        />
      </div>

      <div className="flex flex-col md:items-center">
        <h1 className="heading lg:max-w-[40vw]  ">
          Ready to <span className="text-[#00ED82]">fortify</span> your online
          security?
        </h1>
        <p className="text-white-200 md:mt-10 mt-5 mb-8 text-center">
          Get in touch today and learn how{" "}
          <span className="text-[#00ED82]">
            {" "}
            <br /> URL-Fortify
          </span>{" "}
          can protect your digital assets from phishing threats.
        </p>
        <a href="mailto:support@phishtrap.io">
          <MagicButton
            title="Contact Us"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-center items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2024 <span className="text-[#00ED82]">URL-Fortify</span>.
          All rights reserved.
        </p>

        {/* <div className="flex items-center mt-6 md:gap-3 gap-4">
          {socialMedia.map((info) => (
            <div
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <Image
                src={info.img}
                alt="icons"
                width={20}
                height={20}
                className="w-auto h-auto"
              />
            </div>
          ))}
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
