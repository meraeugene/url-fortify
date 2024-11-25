import React from "react";

const RISKY_KEYWORDS = [
  "phishing",
  "fraud",
  "scam",
  "illegal",
  "unethical",
  "suspicious",
  "spam",
  "spyware",
  "malware",
];

const containsRiskyKeyword = (value: string | number): boolean => {
  if (typeof value === "string") {
    const normalizedValue = value.toLowerCase();
    return RISKY_KEYWORDS.some((keyword) => normalizedValue.includes(keyword));
  }
  return false;
};

export const CategoriesCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  const hasRiskyValue = containsRiskyKeyword(value);

  return (
    <div
      className={`${
        hasRiskyValue
          ? "shadow-sm shadow-red-500 "
          : "shadow-sm shadow-green-500"
      }   border p-4`}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
        borderRadius: "calc(1.75rem * 0.96)",
      }}
    >
      <div className="analysis__container text-center">
        <h1 className="text-xs mb-2 lg:text-base font-semibold tracking-wider">
          {title.toUpperCase()}
        </h1>
        <p
          className={`${
            hasRiskyValue ? "text-red-500" : "text-green-500"
          } text-center text-base lg:text-2xl  font-bold  `}
        >
          {value}
        </p>
        <p className="text-sm mt-2 font-semibold text-gray-400">
          This is the analysis provided by the {title} regarding the
          website&apos;s classification.
        </p>
      </div>
    </div>
  );
};
