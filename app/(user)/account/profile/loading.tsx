import { Skeleton } from "@/components/ui/Skeleton";

const loading = () => {
  return (
    <div className="bg-black-100 py-8 px-4 h-screen md:flex md:items-center md:justify-center md:flex-col w-full ">
      <div className="w-full md:w-1/2 lg:w-[40%] xl:w-[30%] 2xl:w-[25%]">
        <Skeleton className="bg-black-200 h-6 mb-6 md:h-8 rounded-none w-[15%]" />
        <Skeleton className="bg-black-300 h-6 mb-6 md:mb-10 lg:mb-12 rounded-none w-1/2" />

        <Skeleton className="bg-black-200 rounded-sm h-[85px] border-slate-800 w-full" />

        <Skeleton className="bg-black-300 h-4 mt-6 rounded-none w-1/3" />
        <Skeleton className="bg-black-200 h-8 mt-6 rounded-none w-full" />

        <Skeleton className="bg-black-300 h-4 mt-6 rounded-none w-1/3" />
        <Skeleton className="bg-black-200 h-8 mt-6 rounded-none w-full" />

        <Skeleton className="bg-black-300 h-10 mt-6 rounded-none w-full" />
      </div>
    </div>
  );
};

export default loading;
