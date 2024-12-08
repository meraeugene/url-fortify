"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/AnimatedModal";
import { RiRefundLine, RiErrorWarningLine } from "react-icons/ri";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { BsPersonCheck } from "react-icons/bs";
import { GoQuestion } from "react-icons/go";
import { useToast } from "@/hooks/useToast";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";
import MiniLoader from "@/components/MiniLoader";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function RefundForm() {
  const {
    data: user,
    error: errorProfile,
    isLoading: loadingProfile,
  } = useSWR("/api/user", fetcher);

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  if (errorProfile) {
    return (
      <div className=" h-screen flex flex-col items-center justify-center text-center  font-medium   ">
        <div className="border-red-500 border rounded-sm  text-red-500 py-2 px-4 text-xl flex items-center justify-center gap-2">
          <RiErrorWarningLine />
          <p>{errorProfile.response.data.message}</p>
        </div>
      </div>
    );
  }

  if (loadingProfile) return <MiniLoader />;

  const handleRefund = async () => {
    if (!reason) {
      toast({
        title: "Error processing refund",
        description: "Please select a reason before proceeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        reason,
        amount: user.payments[0].amount,
        paymentId: user.payments[0].paymentId,
        paymentMongoId: user.payments[0]._id,
        userId: user._id,
      };

      const response = await fetch("/api/create-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData?.message || "Failed to process checkout.");
      }

      const responseData = await response.json();
      const { title, description } = responseData.message;
      toast({
        title,
        description,
      });

      document.body.style.overflow = "auto";

      router.push(responseData.redirect_url);
    } catch (error: any) {
      toast({
        title: "Error processing refund",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-red-600  rounded-full text-white flex justify-center group/modal-btn py-2 px-3 md:py-3 md:px-4">
          <span className="group-hover/modal-btn:translate-x-40 text-center font-semibold text-sm  transition duration-500">
            Continue to refund
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            <RiRefundLine fontSize={24} />
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="pt-6 text-base md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center ">
              Please state your{" "}
              <span className="text-green-400 font-extrabold bg-black-300 py-2 px-3 ml-2 rounded-sm">
                Reason
              </span>{" "}
            </h4>

            <div className="md:pt-10 pt-8 pb-0 ">
              <div className="flex flex-col gap-4">
                <div
                  className={`font-bold tracking-wider w-full border ${
                    reason === "duplicate"
                      ? "border-2 border-blue-500"
                      : "border-gray-800"
                  } py-3 rounded-md lg:text-2xl hover:border-blue-500 flex items-center gap-3 justify-center cursor-pointer transition-all ease-in-out md:text-xl`}
                  onClick={() => setReason("duplicate")}
                >
                  <HiOutlineDocumentDuplicate />
                  <h1> Duplicate</h1>
                </div>

                <div
                  className={`font-bold tracking-wider w-full border ${
                    reason === "fraudulent"
                      ? "border-2 border-blue-500"
                      : "border-gray-800"
                  } py-3 rounded-md lg:text-2xl hover:border-blue-500 md:text-xl flex items-center justify-center gap-3 cursor-pointer transition-all ease-in-out`}
                  onClick={() => setReason("fraudulent")}
                >
                  <RiErrorWarningLine />
                  <h1> Fraudulent</h1>
                </div>

                <div
                  className={`font-bold tracking-wider w-full border ${
                    reason === "requested_by_customer"
                      ? "border-2 border-blue-500"
                      : "border-gray-800"
                  } py-3 rounded-md lg:text-2xl hover:border-blue-500 md:text-xl cursor-pointer flex items-center justify-center gap-3 transition-all ease-in-out`}
                  onClick={() => setReason("requested_by_customer")}
                >
                  <BsPersonCheck />
                  <h1> Requested by customer</h1>
                </div>

                <div
                  className={`font-bold md:text-xl tracking-wider w-full border ${
                    reason === "others"
                      ? "border-2 border-blue-500"
                      : "border-gray-800"
                  } py-3 rounded-md lg:text-2xl hover:border-blue-500 cursor-pointer transition-all flex items-center justify-center gap-3 ease-in-out`}
                  onClick={() => setReason("others")}
                >
                  <GoQuestion />
                  <h1> Others</h1>
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button
              className="bg-red-600 rounded-full text-white flex justify-center group/modal-btn py-2 px-3 md:py-2 md:px-4 w-[40%] md:w-[15%]"
              onClick={handleRefund}
              disabled={loading}
            >
              {loading ? (
                <Image src="/loader.svg" width={24} height={24} alt="loader" />
              ) : (
                "Proceed"
              )}
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
