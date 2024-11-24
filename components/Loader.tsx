"use client";
import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { MultiStepLoader as Loader } from "./ui/MultiStepLoader";

const loadingStates = [
  {
    text: "Capturing website screenshot for Safety Snapshot",
  },
  {
    text: "Gathering classification data for Classification Overview",
  },
  {
    text: "Collecting analysis statistics for Analysis Statistics",
  },
  {
    text: "Fetching detailed results for Analysis Results",
  },
  {
    text: "Finalizing security assessment in Complete Analysis",
  },
];

export function MultiStepLoader({ loading }: { loading: boolean }) {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} loop={false} />

      {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
      {/* <button
        className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
        style={{
          boxShadow:
            "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
        }}
      >
        Click to load
      </button> */}
      {/* 
      {loading && (
        <button className="fixed top-4 right-4 text-black dark:text-white z-[120]">
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )} */}
    </div>
  );
}
