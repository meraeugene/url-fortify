import React, { useMemo } from "react";
import { getDescription, getStyleByTitle } from "../helpers/classesUtils";

export const AnalysisStatisticsCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  const { boxShadow, textColor } = getStyleByTitle(title);

  return (
    <div
      className={`${boxShadow}  border p-4`}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
        borderRadius: `calc(1.75rem * 0.96)`,
      }}
    >
      <div className="analysis__container  text-center">
        <h1 className={`text-base font-semibold tracking-wider ${textColor}`}>
          {title.toUpperCase()}
        </h1>
        <p className={`text-center text-3xl font-bold ${textColor}`}>{value}</p>
        <p className="text-sm mt-3 font-semibold text-gray-400">
          {getDescription(title)}
        </p>
      </div>
    </div>
  );
};
