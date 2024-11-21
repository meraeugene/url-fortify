import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

interface AnalysisResultsCardProps {
  engineName: string;
  result: string;
}

const AnalysisResultsCard = ({
  engineName,
  result,
}: AnalysisResultsCardProps) => {
  const capitalizedResult = result.charAt(0).toUpperCase() + result.slice(1);

  // Define a mapping of result types to text colors and icons
  const getTextColorAndIcon = (result: string) => {
    switch (result.toLowerCase()) {
      case "malicious":
      case "phishing":
        return {
          color: "text-red-500",
          icon: <RiErrorWarningLine color="#dc2626" />, // Red warning icon
        };
      case "suspicious":
        return {
          color: "text-yellow-500",
          icon: <RiErrorWarningLine color="#eab308" />, // Yellow warning icon
        };
      case "clean":
        return {
          color: "text-green-500",
          icon: <IoShieldCheckmarkSharp color="#22c55e" />, // Green shield icon
        };
      case "clean":
        return {
          color: "text-gray-400",
          icon: <HiOutlineQuestionMarkCircle color="#9ca3af" />, // Green shield icon
        };
      default:
        return {
          color: "text-gray-400",
          icon: null,
        };
    }
  };

  const { color, icon } = getTextColorAndIcon(result);

  return (
    <div className="flex text-sm">
      <div
        className="border border-r-0 px-2 py-3 w-full basis-[80%]"
        style={{
          background: "rgb(4,7,29)",
          backgroundColor:
            "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
        }}
      >
        {engineName}
      </div>
      <div
        className={`border border-l-0 px-2 py-3 w-full font-medium basis-[20%] ${color}`}
        style={{
          background: "rgb(4,7,29)",
          backgroundColor:
            "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
        }}
      >
        <div className="flex items-center justify-between gap-[0.30rem]">
          <span>{icon}</span>
          <span>{capitalizedResult}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsCard;
