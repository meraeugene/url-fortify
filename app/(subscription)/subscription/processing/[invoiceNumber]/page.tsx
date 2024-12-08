"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ invoiceNumber: string }>();

  useEffect(() => {
    if (params.invoiceNumber) {
      // Simulate processing with a delay (e.g., 3 seconds)
      const timer = setTimeout(() => {
        // Redirect to success page with invoiceNumber
        router.push(`/subscription/success/${params.invoiceNumber}`);
      }, 3000); // Adjust the delay as needed

      // Cleanup timer when the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [params.invoiceNumber, router]); // Dependency array ensures the effect is re-run when invoiceNumber changes

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1>Processing Your Payment...</h1>
        <p>Please wait while we confirm your payment.</p>
      </div>
    </div>
  );
};

export default Page;
