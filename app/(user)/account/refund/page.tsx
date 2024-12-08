import { RefundForm } from "@/components/RefundForm";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

const page = () => {
  return (
    <div className="bg-black-100 px-4 py-8  pb-12 md:pb-14  h-full md:justify-center md:items-center md:flex md:flex-col ">
      <div className="md:mx-auto ">
        <Link
          href="/account/overview"
          className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm mb-6 md:mb-8 w-[15%] md:w-[12%] flex items-center justify-center"
        >
          <IoArrowBack />
        </Link>

        <div className="flex items-center justify-center flex-col text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            How your scans will change
          </h1>
          <p className="text-sm md:text-base">
            If you refund, you&apos;ll switch to our{" "}
            <span className="text-green-400 font-medium">Fortify Free</span>.
          </p>
          <p className="text-sm md:text-base">
            Here&apos;s how your scanning capabilities will change:
          </p>

          <div className="flex items-center justify-center flex-col gap-6 mt-4">
            <div className="flex items-center justify-center flex-col">
              <h1 className="text-8xl font-extrabold text-green-400 md:text-9xl">
                10
              </h1>
              <p className="text-sm md:text-base w-[60%] md:w-[80%]">
                You&apos;ll be limited to 10 URL scans per month.
              </p>
            </div>

            <div className="flex items-center justify-center flex-col">
              <h1 className="text-8xl font-extrabold text-green-400 md:text-9xl">
                10
              </h1>
              <p className="text-sm md:text-base md:w-[60%] w-[70%] ">
                You&apos;ll have access to only 10 basic website snapshots per
                month.
              </p>
            </div>

            <div className="flex items-center justify-center flex-col">
              <h1 className="text-8xl font-extrabold text-green-400 md:text-9xl">
                10
              </h1>
              <p className="text-sm md:text-base md:w-[60%] w-[70%]">
                Only 10 screenshot-based URL scans per month will be available.
              </p>
            </div>

            <h1 className="text-sm md:text-base">Complete analysis</h1>

            <div className="flex items-center gap-6 mt-1">
              <button className="text-sm py-2 px-3 md:py-3 md:px-4 rounded-full font-semibold bg-green-400   transition-all duration-300 ease-in-out hover:bg-green-500 text-black">
                <Link href="/account/overview">Back to account</Link>
              </button>

              <RefundForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
