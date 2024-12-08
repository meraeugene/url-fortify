import { Skeleton } from "@/components/ui/Skeleton";

const SubscriptionLoader = () => {
  const array = new Array(3).fill(null);

  return (
    <div className="bg-black-100 py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
        {array.map((_, index) => (
          <Skeleton
            key={index}
            className="text-white rounded-3xl  h-[30rem]  pb-6  bg-black-200 border-slate-800 border w-full"
          >
            <Skeleton className="bg-black-300 rounded-tr-3xl rounded-tl-3xl h-12 mb-6  rounded-br-none rounded-bl-none" />

            <div className="px-5">
              <Skeleton className="bg-black-300 h-8 mb-5 rounded-none" />
              <Skeleton className="bg-black-300 h-8  w-12 mb-3 rounded-none" />
              <Skeleton className="bg-black-300 h-4 w-[60%]  mb-6 rounded-none" />

              <Skeleton className="bg-black-300 h-4  mb-4 rounded-none" />
              <Skeleton className="bg-black-300 h-4  mb-4 rounded-none" />
              <Skeleton className="bg-black-300 h-4  mb-4 rounded-none" />
              <Skeleton className="bg-black-300 h-4  mb-4 rounded-none" />
              <Skeleton className="bg-black-300 h-4  mb-4 rounded-none" />
              <Skeleton className="bg-black-300 h-4  mb-7 rounded-none" />
              <Skeleton className="bg-black-300 h-10  rounded-none" />
            </div>
          </Skeleton>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionLoader;
