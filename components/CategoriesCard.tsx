import React from "react";
import { containsRiskyKeyword, getCardClasses } from "../helpers/classesUtils";

export const CategoriesCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  const hasRiskyValue = containsRiskyKeyword(value);
  const { shadowClasses, textClasses } = getCardClasses(hasRiskyValue);

  return (
    <div
      className={`${shadowClasses} shadow-sm shadow-green-500  border p-4`}
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
          className={`text-center text-base lg:text-2xl  font-bold ${textClasses}`}
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
