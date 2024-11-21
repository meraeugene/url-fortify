"use client";
import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { MultiStepLoader as Loader } from "./ui/MultiStepLoader";

const loadingStates = [
  {
    text: "Initializing security scan",
  },
  {
    text: "Verifying URL format",
  },
  {
    text: "Connecting to security databases",
  },
  {
    text: "Checking for known phishing indicators",
  },
  {
    text: "Analyzing website reputation",
  },
  {
    text: "Inspecting domain authenticity",
  },
  {
    text: "Reviewing historical threats",
  },
  {
    text: "Assessing site behavior patterns",
  },
  {
    text: "Finalizing security assessment",
  },
  {
    text: "Displaying results",
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
