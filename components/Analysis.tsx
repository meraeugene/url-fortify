import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/Timeline";
import { AnalysisData, AnalysisResult, AnalysisResultEntry } from "@/types";
import { cn } from "@/lib/utils";
import { AnalysisStatisticsCard } from "./AnalysisStatisticsCard";
import { CategoriesCard } from "./CategoriesCard";
import AnalysisResultsCard from "./AnalysisResultsCard";

export function Analysis({
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

  const data = [
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
  ];

  return (
    <div className="w-full mt-14">
      <Timeline data={data} />
    </div>
  );
}
