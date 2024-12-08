"use client";
import { useState } from "react";
import { isValidUrl } from "../helpers/urlUtils";
import { AnalysisData } from "@/types";
import { useToast } from "@/hooks/useToast";

const useUrlAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [scanLimitError, setScanLimitError] = useState<boolean>(false);

  const { toast } = useToast();

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

    // Initialize loading state and reset errors
    setLoading(true);
    setScanLimitError(false);
    try {
      // Define API endpoints
      const captureUrl = `/api/proxy/capture?url=${encodeURIComponent(url)}`;
      const reportUrl = `/api/proxy/virustotal?url=${encodeURIComponent(url)}`;

      // Execute API calls in parallel
      const [captureResponse, reportResponse] = await Promise.all([
        fetch(captureUrl, { next: { revalidate: 60 * 60 * 24 } }), // 24 hours
        fetch(reportUrl, { next: { revalidate: 60 * 60 * 24 } }), // 24 hours
      ]);

      // Process responses in parallel using Promise.all
      const [captureData, reportData] = await Promise.all([
        captureResponse.ok
          ? captureResponse.json()
          : Promise.reject(await captureResponse.json()),
        reportResponse.ok
          ? reportResponse.json()
          : Promise.reject(await reportResponse.json()),
      ]);

      // Extract data from the responses
      const { screenshot } = captureData;
      const { data } = reportData;
      const { categories, last_analysis_stats, last_analysis_results } =
        data.attributes;

      // Handle specific errors (e.g., timeouts)
      if (captureResponse.status === 504) {
        toast({
          title: "API Flash Service Timeout",
          description:
            "The API Flash service is currently experiencing delays in capturing the screenshot.  Please try again later. If this issue persists, it may indicate temporary service disruptions. ",
        });
      }

      if (reportResponse.status === 504) {
        toast({
          title: "VirusTotal API Timeout",
          description:
            "The VirusTotal API is currently taking longer than expected to respond. Please try again in a few moments.",
        });
      }

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json();
        throw new Error(errorData.message || "Failed to capture screenshot.");
      }

      if (!reportResponse.ok) {
        const errorData = await reportResponse.json();
        throw new Error(
          errorData?.message || "Failed to fetch VirusTotal report."
        );
      }

      // Perform scan limit validation
      const scanLimitResponse = await fetch("/api/scan-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captureStatus: captureResponse.status,
          reportStatus: reportResponse.status,
        }),
      });

      if (!scanLimitResponse.ok) {
        setScanLimitError(true); // Set error flag
        const errorData = await scanLimitResponse.json();
        throw new Error(
          errorData?.message || "Failed to fetch Scan Limit API."
        );
      }

      const scanLimitData = await scanLimitResponse.json();
      const successMessage =
        scanLimitData?.message || "Analysis was successful.";

      // Prepare data to be cached and set in state
      const analysisData: AnalysisData = {
        url,
        screenshot,
        categories,
        lastAnalysisStats: last_analysis_stats,
        lastAnalysisResults: last_analysis_results,
      };

      setAnalysisData(analysisData);

      toast({
        title: "URL Analysis Complete",
        description: successMessage || "Analysis was successful.",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { analyzeUrl, analysisData, loading, scanLimitError };
};

export default useUrlAnalysis;
