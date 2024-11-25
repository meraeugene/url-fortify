"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { isValidUrl, trimUrl } from "../helpers/urlUtils";
import { AnalysisData } from "@/types";

const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_CONSECUTIVE_REQUESTS = 3;

const useUrlAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  // Get cached data from sessionStorage
  const getCachedData = (url: string): AnalysisData | null => {
    try {
      const cached = sessionStorage.getItem(url);
      if (!cached) return null;

      const { data, expiration } = JSON.parse(cached);

      // If the cache is expired, return null
      if (Date.now() > expiration) {
        sessionStorage.removeItem(url); // Remove expired cache
        return null;
      }

      return data;
    } catch {
      return null;
    }
  };

  // Cache data in sessionStorage with expiration timestamp
  const cacheData = (url: string, data: AnalysisData) => {
    const expiration = Date.now() + CACHE_EXPIRATION_TIME;
    const cachedData = { data, expiration };
    sessionStorage.setItem(url, JSON.stringify(cachedData));
  };

  const analyzeUrl = async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (must start with http or https)");
      return;
    }

    if (requestCount >= MAX_CONSECUTIVE_REQUESTS) {
      toast.error(
        "You can make a maximum of 3 consecutive requests. Please try again later."
      );
      return;
    }

    // Trim the URL to its base domain using the helper function
    const trimmedUrl = trimUrl(url);

    // Check if cached data exists in sessionStorage
    const cachedAnalysisData = getCachedData(trimmedUrl);
    if (cachedAnalysisData) {
      setAnalysisData(cachedAnalysisData); // Set the cached data to the state
      toast.success("URL Analysis Complete");
      return; // Skip the API call if cached data is available
    }

    setLoading(true);
    setRequestCount(requestCount + 1);

    let successMessage = "";

    try {
      // Fetch the screenshot using fetch API
      const captureResponse = await fetch(
        `/api/proxy/capture?url=${encodeURIComponent(trimmedUrl)}`,
        {
          next: {
            revalidate: 60 * 60 * 24, // 24 hours
          },
        }
      );

      if (!captureResponse.ok) {
        const contentType = captureResponse.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await captureResponse.json();
          const errorMessage = errorData?.error || "Unknown error";
          throw new Error(errorMessage);
        } else {
          const text = await captureResponse.text(); // Get the response as plain text
          throw new Error(`Unexpected response format: ${text}`);
        }
      }

      const captureData = await captureResponse.json(); // Parse JSON

      const { screenshot } = captureData;

      if (screenshot) {
        // Fetch the VirusTotal report using fetch API
        const reportResponse = await fetch(
          `/api/proxy/virustotal?url=${encodeURIComponent(trimmedUrl)}`,
          {
            next: {
              revalidate: 60 * 60 * 24, // 24 hours
            },
          }
        );

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
          url: trimmedUrl,
          screenshot,
          categories,
          lastAnalysisStats: last_analysis_stats,
          lastAnalysisResults: last_analysis_results,
        };

        setAnalysisData(analysisData);
        cacheData(trimmedUrl, analysisData); // Cache the new analysis data
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      if (successMessage) {
        toast.success(successMessage);
      }

      // Reset the request count after a brief delay
      setTimeout(() => {
        setRequestCount(0);
      }, 60000); // Reset after 60 seconds
    }
  };

  return { analyzeUrl, analysisData, loading };
};

export default useUrlAnalysis;
