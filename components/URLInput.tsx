"use client";
import useUrlAnalysis from "@/hooks/useUrlAnalysis";
import React, { FormEvent, useState } from "react";
import MagicButton from "./MagicButton";
import { FaShieldAlt } from "react-icons/fa";
import { Analysis } from "./Analysis";
import { MultiStepLoader } from "./Loader";

const URLInput = () => {
  const [url, setUrl] = useState<string>("");
  const { analyzeUrl, analysisData, loading } = useUrlAnalysis();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    analyzeUrl(url);
  };

  return (
    <div className="w-full ">
      <div className="w-full md:w-[90%] lg:w-[80%] mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-2 lg:mt-10 mt-5 "
        >
          <div className="lg:basis-[80%] md:basis-[70%] w-full">
            <input
              className="bg-slate-950 px-4 border border-[#00ED82] w-full h-12 md:rounded-tl-lg md:rounded-bl-lg rounded-lg lg:rounded-br-none lg:rounded-tr-none"
              type="text"
              placeholder="Enter your URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="url input"
            />
          </div>
          <div className="lg:basis-[20%] md:basis-[30%] basis-full w-full mt-2 md:mt-0 ">
            <MagicButton
              title={loading ? "Analyzing..." : "Analyze"}
              icon={loading ? null : <FaShieldAlt />}
              position="right"
              disabled={loading}
              otherClasses="rounded-lg lg:rounded-none"
            />
          </div>
        </form>
      </div>

      {loading && <MultiStepLoader loading={loading} />}

      {analysisData && (
        <Analysis
          screenshot={analysisData?.screenshot}
          categories={analysisData.categories}
          lastAnalysisStats={analysisData.lastAnalysisStats}
          lastAnalysisResults={analysisData.lastAnalysisResults}
        />
      )}
    </div>
  );
};

export default URLInput;
