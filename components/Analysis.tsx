import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/Timeline";
import { AnalysisData, AnalysisResult, AnalysisResultEntry } from "@/types";
import { cn } from "@/lib/utils";
import { AnalysisStatisticsCard } from "./AnalysisStatisticsCard";
import { CategoriesCard } from "./CategoriesCard";
import AnalysisResultsCard from "./AnalysisResultsCard";

export function Analysis({
  url,
  screenshot,
  categories,
  lastAnalysisResults,
  lastAnalysisStats,
}: AnalysisData) {
  //Define the custom sort order for analysis results
  const sortOrder: AnalysisResult[] = [
    AnalysisResult.Phishing,
    AnalysisResult.Malicious,
    AnalysisResult.Suspicious,
    AnalysisResult.Clean,
    AnalysisResult.Unrated,
  ];

  const sortedResults = Object.values(lastAnalysisResults).sort(
    (resultA: AnalysisResultEntry, resultB: AnalysisResultEntry) =>
      sortOrder.indexOf(resultA.result) - sortOrder.indexOf(resultB.result)
  );

  const isSafe = sortedResults.every(
    (result) =>
      result.result === AnalysisResult.Clean ||
      result.result === AnalysisResult.Unrated ||
      result.result === AnalysisResult.Suspicious
  );

  const data = [
    {
      title: "URL",
      content: (
        <div
          className="text-base lg:text-2xl p-4 border rounded-lg w-full max-w-[290px] lg:max-w-[350px]  2xl:max-w-[650px] "
          style={{
            background: "rgb(4,7,29)",
            backgroundColor:
              "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {url}
        </div>
      ),
    },
    {
      title: "Safety Snapshot",
      content: (
        <div>
          <p className="text-[#F8F8F8] text-base font-normal mb-8">
            This snapshot offers a visual preview of the scanned website, along
            with key security insights to help identify potential phishing
            threats.
          </p>
          <div>
            <Image
              src={screenshot || ""}
              alt="website screenshot"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Classification Overview",
      content: (
        <div>
          <p className="text-base font-normal text-[#F8F8F8] mb-8">
            Below is the classification provided by various security engines
            regarding the website.
          </p>
          <div className="grid grid-cols-1 gap-7">
            {Object.entries(categories).map(([key, value], index) => (
              <CategoriesCard title={key} key={index} value={value} />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Analysis Statistics",
      content: (
        <div>
          <p className="text-base font-normal text-[#F8F8F8] mb-8">
            A summary of the latest URL analysis, including classifications for
            malicious, suspicious, harmless, undetected, and timeouts.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-7">
            {Object.entries(lastAnalysisStats).map(([key, value], index) => (
              <AnalysisStatisticsCard key={index} title={key} value={value} />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Analysis Results",
      content: (
        <div>
          <p className="text-base font-normal text-[#F8F8F8] mb-8">
            Below are the latest analysis results, offering a detailed overview
            of the URL&apos;s safety and any potential security risks identified
            by various engines{" "}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {Object.entries(sortedResults).map(([_, result], index) => (
              <AnalysisResultsCard
                key={index}
                engineName={result.engine_name}
                result={result.result}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Complete Analysis",
      content: (
        <>
          <p className="text-base font-normal text-[#F8F8F8] mb-8">
            {isSafe
              ? "Congratulations! The URL has passed all security checks..."
              : "Warning: The URL has been flagged for potential security risks..."}
          </p>
          <div
            className={`border rounded-lg p-4 shadow-sm ${
              isSafe ? "shadow-green-500" : "shadow-red-500"
            }`}
          >
            <h1
              className={`${
                isSafe ? "text-green-500" : "text-red-500"
              } text-center uppercase tracking-wider text-base lg:text-3xl font-bold`}
            >
              {isSafe ? "Fortified URL" : "Vulnerable URL"}
            </h1>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="w-full mt-14">
      <Timeline data={data} />
    </div>
  );
}
