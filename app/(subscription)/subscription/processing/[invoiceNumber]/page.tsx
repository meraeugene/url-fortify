"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ invoiceNumber: string }>();

  useEffect(() => {
    if (params.invoiceNumber) {
      // Simulate processing with a delay (e.g., 3 seconds)
      const timer = setTimeout(() => {
        // Redirect to success page with invoiceNumber
        router.push(`/subscription/success/${params.invoiceNumber}`);
      }, 15000); // Adjust the delay as needed

      // Cleanup timer when the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [params.invoiceNumber, router]); // Dependency array ensures the effect is re-run when invoiceNumber changes

  return (
    <div className="flex items-center justify-center flex-col gap-2 h-screen text-center mx-auto ">
      <div className="text-sm mx-auto flex flex-col items-center justify-center gap-2">
        <Image src="/loader.svg" width={30} height={30} alt="loader" />
        <h1>Processing Your Payment...</h1>
        <p>Please wait while we confirm your payment.</p>
      </div>
    </div>
  );
};

export default Page;
