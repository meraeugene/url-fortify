"use client";
import { useState } from "react";
import { isValidUrl } from "../helpers/urlUtils";
import { AnalysisData } from "@/types";
import { useToast } from "@/hooks/useToast";

const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const useUrlAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const { toast } = useToast();

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
      toast({
        title: "Invalid URL",
        description:
          "Please enter a valid URL (must start with http or https).",
        variant: "destructive",
      });
      return;
    }

    // Check if cached data exists in sessionStorage
    const cachedAnalysisData = getCachedData(url);
    if (cachedAnalysisData) {
      setAnalysisData(cachedAnalysisData); // Set the cached data to the state
      toast({
        title: "URL Analysis Complete",
      });
      return; // Skip the API call if cached data is available
    }

    setLoading(true);

    let successMessage = "";

    try {
      // Fetch the screenshot using fetch API
      const captureResponse = await fetch(
        `/api/proxy/capture?url=${encodeURIComponent(url)}`,
        {
          next: {
            revalidate: 60 * 60 * 24, // 24 hours
          },
        }
      );

      if (captureResponse.status === 504) {
        toast({
          title: "API Flash Service Timeout",
          description:
            "The API Flash service is currently experiencing delays in capturing the screenshot.  Please try again later. If this issue persists, it may indicate temporary service disruptions. ",
        });
      }

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json();
        const errorMessage =
          errorData?.message || "Failed to capture screenshot.";
        throw new Error(errorMessage);
      }

      const captureData = await captureResponse.json(); // Parse JSON

      const { screenshot } = captureData;

      if (screenshot) {
        // Fetch the VirusTotal report using fetch API
        const reportResponse = await fetch(
          `/api/proxy/virustotal?url=${encodeURIComponent(url)}`,
          {
            next: {
              revalidate: 60 * 60 * 24, // 24 hours
            },
          }
        );

        if (reportResponse.status === 504) {
          toast({
            title: "VirusTotal API Timeout",
            description:
              "The VirusTotal API is currently taking longer than expected to respond. Please try again in a few moments. If this issue persists, it may indicate temporary service disruptions.",
          });
        }

        if (!reportResponse.ok) {
          const errorData = await reportResponse.json();
          const errorMessage =
            errorData?.message || "Failed to fetch VirusTotal report.";
          throw new Error(errorMessage);
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
      console.log(error);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (successMessage) {
        toast({
          title: successMessage,
          description: "Your website has been successfully analyzed.",
        });
      }
    }
  };

  return { analyzeUrl, analysisData, loading };
};

export default useUrlAnalysis;
