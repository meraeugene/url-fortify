import { Skeleton } from "@/components/ui/Skeleton";

const loading = () => {
  return (
    <div className="bg-black-100 py-8 px-4 h-screen md:h-full">
      <div className=" md:max-w-xl lg:max-w-[60vw] md:mx-auto md:justify-center md:items-center  xl:max-w-[40vw] 2xl:max-w-[35vw]">
        <Skeleton className="bg-black-300 h-6 md:h-8 mb-6 rounded-none w-[15%] md:w-[10%]" />
        <Skeleton className="bg-black-300 h-6 mb-6 rounded-none w-1/2" />
        <Skeleton className="bg-black-200 rounded-sm h-[150px] md:h-[325px] lg:h-[345px] xl:h-[325px] border-slate-800 w-full" />
        <Skeleton className="bg-black-300 h-6 w-full mt-6 rounded-none" />
        <Skeleton className="bg-black-300 h-6 mt-6 rounded-none w-1/2" />
        <Skeleton className="bg-black-200 rounded-sm h-[350px] mt-8 md:h-[325px] lg:h-[345px] xl:h-[325px] border-slate-800 w-full lg:w-1/2" />
      </div>
    </div>
  );
};

export default loading;
