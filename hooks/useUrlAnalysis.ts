"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { isValidUrl } from "../helpers/urlUtils";
import { AnalysisData } from "@/types";

const useUrlAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // Get cached data from sessionStorage
  const getCachedData = (url: string): AnalysisData | null => {
    const cachedData = sessionStorage.getItem(url);
    return cachedData ? JSON.parse(cachedData) : null;
  };

  // Cache data in sessionStorage
  const cacheData = (url: string, data: AnalysisData) => {
    sessionStorage.setItem(url, JSON.stringify(data));
  };

  const analyzeUrl = async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (must start with http or https)");
      return;
    }

    // Check if cached data exists in sessionStorage
    const cachedAnalysisData = getCachedData(url);
    if (cachedAnalysisData) {
      setAnalysisData(cachedAnalysisData); // Set the cached data to the state
      toast.success("URL Analysis Complete");
      return; // Skip the API call if cached data is available
    }

    setLoading(true);

    let successMessage = "";

    try {
      // Fetch the screenshot using fetch API
      const captureResponse = await fetch(`/api/proxy/capture?url=${url}`, {
        next: {
          revalidate: 60 * 60 * 24, //24 hours
        },
      });

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json();
        const errorMessage = errorData?.error;
        throw new Error(errorMessage);
      }

      const captureData = await captureResponse.json(); // Parse JSON

      const { screenshot } = captureData;

      if (screenshot) {
        // Fetch the VirusTotal report using fetch API
        const reportResponse = await fetch(`/api/proxy/virustotal?url=${url}`, {
          next: {
            revalidate: 60 * 60 * 24, //24 hours
          },
        });

        if (!reportResponse.ok) {
          const errorData = await reportResponse.json();
          const errorMessage = errorData?.error;
          throw Error(errorMessage);
        }

        const reportData = await reportResponse.json();

        const { message, data } = reportData;

        // If the message is success, save it in the variable
        if (message === "URL Analysis Complete") {
          successMessage = message;
        }

        const { categories, last_analysis_stats, last_analysis_results } =
          data.attributes;

        // Prepare data to be cached and set in state
        const analysisData: AnalysisData = {
          url,
          screenshot,
          categories,
          lastAnalysisStats: last_analysis_stats,
          lastAnalysisResults: last_analysis_results,
        };

        setAnalysisData(analysisData);
        cacheData(url, analysisData); // Cache the new analysis data
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      if (successMessage) {
        toast.success(successMessage);
      }
    }
  };

  return { analyzeUrl, analysisData, loading };
};

export default useUrlAnalysis;
