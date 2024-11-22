import { useState } from "react";
import toast from "react-hot-toast";
import { isValidUrl } from "../helpers/urlUtils";
import { AnalysisData } from "@/types";

const useUrlAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [screenshotLoading, setScreenshotLoading] = useState<boolean>(false); // for screenshot fetching
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const getDomain = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch {
      return url; // fallback to original if parsing fails (not a valid URL)
    }
  };

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

    const trimmedUrl = getDomain(url); // Extract protocol + domain

    // Check if cached data exists in sessionStorage
    const cachedAnalysisData = getCachedData(trimmedUrl);
    if (cachedAnalysisData) {
      setAnalysisData(cachedAnalysisData); // Set the cached data to the state
      toast.success("URL Analysis Complete"); // Show success toast even when using cached data
      return; // Skip the API call if cached data is available
    }

    setLoading(true);

    try {
      setScreenshotLoading(true); // Set the screenshot loading state to true

      // Log the encoded URL for the screenshot API call
      const encodedUrl = encodeURIComponent(trimmedUrl);
      console.log("Encoded URL for screenshot API:", encodedUrl);

      // Fetch the screenshot using fetch API
      const captureResponse = await fetch(
        `/api/proxy/capture?url=${encodedUrl}`,
        {
          next: {
            revalidate: 60 * 60 * 24, //24 hours
          },
        }
      );
      const captureData = await captureResponse.json();
      setScreenshotLoading(false); // Set the screenshot loading state to false when done

      const { screenshot } = captureData;

      if (screenshot) {
        // Log the encoded URL for the VirusTotal API call
        console.log("Encoded URL for VirusTotal API:", encodedUrl);

        // Fetch the VirusTotal report using fetch API
        const reportResponse = await fetch(
          `/api/proxy/virustotal?url=${encodeURIComponent(trimmedUrl)}`,
          {
            next: {
              revalidate: 60 * 60 * 24, //24 hours
            },
          }
        );
        const reportData = await reportResponse.json();

        const { categories, last_analysis_stats, last_analysis_results } =
          reportData.data.attributes;

        // Prepare data to be cached and set in state
        const analysisData: AnalysisData = {
          screenshot,
          categories,
          lastAnalysisStats: last_analysis_stats,
          lastAnalysisResults: last_analysis_results,
        };

        setAnalysisData(analysisData);
        cacheData(trimmedUrl, analysisData); // Cache the new analysis data
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error processing request: ${error}`);
    } finally {
      setLoading(false);
      toast.success("URL Analysis Complete");
    }
  };

  return { analyzeUrl, analysisData, loading, screenshotLoading };
};

export default useUrlAnalysis;
