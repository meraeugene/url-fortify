import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { IoShieldCheckmark } from "react-icons/io5";
import Image from "next/image";
import { IoLockClosedSharp } from "react-icons/io5";

const Page = () => {
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
          Refund <br /> Successful
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
              <h1>Fortify Free</h1>

              <Image
                width={70}
                height={70}
                src="/url-fortify-logo.png"
                alt="logo"
              />
            </div>

            <ul className="list-disc  py-5 px-5 ml-5 flex flex-col gap-3">
              <li className="text-base text-white-100 ">
                10 URL scans per month
              </li>

              <li className="text-base text-white-100 ">
                10 full website screenshot per month
              </li>

              <li className="text-base text-white-100 ">
                10 screenshot-based URL scans per month
              </li>

              <li className="text-base text-white-100 ">
                Classification overview
              </li>

              <li className="text-base text-white-100 ">Analysis statistics</li>
              <li className="text-base text-white-100 ">Analysis results</li>
              <li className="text-base text-white-100 ">Complete analysis</li>
            </ul>
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
