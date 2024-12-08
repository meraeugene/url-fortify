"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Simulate processing with a delay (e.g., 3 seconds)
    const timer = setTimeout(() => {
      // Redirect to success page with invoiceNumber
      router.push("/account/overview");
    }, 5000); // Adjust the delay as needed

    // Cleanup timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [router]); // Dependency array ensures the effect is re-run when invoiceNumber changes

  return (
    <div className="flex items-center justify-center flex-col gap-2 h-screen text-center ">
      <div>
        <h1>Processing Your Refund...</h1>
        <p>Please wait while we are confirming your refund.</p>
      </div>
    </div>
  );
};

export default Page;
