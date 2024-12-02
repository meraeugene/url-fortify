import { IoArrowBack, IoInformationCircleOutline } from "react-icons/io5";
import Link from "next/link";

const Page = () => {
  return (
    <div className="bg-black-100 py-8 px-4 lg:py-10 h-screen">
      <div className=" md:max-w-xl  lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[35vw]  mx-auto">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/account/overview"
            className="bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out p-2 rounded-sm w-[15%] md:w-[10%]  flex items-center justify-center"
            aria-label="Back to account overview"
          >
            <IoArrowBack />
          </Link>
          <h1 className="font-bold text-2xl">Order history</h1>
        </div>

        <div className="bg-gray-800 px-4 py-3 rounded-sm flex items-center gap-3">
          <IoInformationCircleOutline fontSize={28} />
          <h1>You have no payments or refunds.</h1>
        </div>
      </div>
    </div>
  );
};

export default Page;
