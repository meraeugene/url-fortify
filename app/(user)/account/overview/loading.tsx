import { Skeleton } from "@/components/ui/Skeleton";

const loading = () => {
  const array = new Array(6).fill(null);
  return (
    <div className="bg-black-100 py-8 px-4">
      <div className=" md:max-w-xl  lg:max-w-[60vw] xl:max-w-[40vw] 2xl:max-w-[35vw] md:mx-auto md:justify-center md:items-center ">
        <Skeleton className="bg-black-300 h-6 md:h-8 md:w-[10%] mb-6 rounded-none w-[15%]" />
        <Skeleton className="bg-black-300 h-6 mb-6 rounded-none w-1/2" />
        <div className="grid grid-cols-1 gap-4 w-full">
          {array.map((_, index) => (
            <Skeleton
              key={index}
              className="text-white rounded-md pt-4 h-32 pb-6 px-4 bg-black-200 border-slate-800 border w-full"
            >
              <Skeleton className="bg-black-300 h-6 mb-6 rounded-none" />
              <Skeleton className="bg-black-300 h-4 mb-3 rounded-none" />
              <Skeleton className="bg-black-300 h-4 rounded-none" />
            </Skeleton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
