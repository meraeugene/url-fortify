import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { isValidUrl, base64EncodeUrl } from "../helpers/urlUtils";
import { AnalysisData } from "@/types";

const useUrlAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const getDomain = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch {
      return url; // fallback to original if parsing fails (not a valid URL)
    }
  };

  // const fetchScreenshotBase64 = async (url: string): Promise<string> => {
  //   const apiUrl = `https://v1.nocodeapi.com/444andreiii/screen/sSwWEwDgigwrZXmi/screenshot?url=${encodeURIComponent(
  //     url
  //   )}&encoding=base64&full_page=true`;

  //   const { data } = await axios.get(apiUrl, {
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   return data; // Returns the Base64-encoded screenshot
  // };

  const analyzeUrl = async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (must start with http or https)");
      return;
    }

    const trimmedUrl = getDomain(url); // Extract protocol + domain

    setLoading(true);

    try {
      // Fetch screenshot in Base64 format
      // const base64Format = await fetchScreenshotBase64(trimmedUrl);

      // Send screenshot to server for further processing
      // const { data: captureResponse } = await axios.post(
      //   "/api/capture",
      //   { url: trimmedUrl },
      //   { headers: { "Content-Type": "application/json" } }
      // );

      const { data: captureResponse } = await axios.get(
        `/api/proxy/capture?url=${encodeURIComponent(trimmedUrl)}`
      );

      const { screenshot } = captureResponse;

      if (screenshot) {
        const { data: reportData } = await axios.get(
          `/api/proxy/virustotal?url=${encodeURIComponent(trimmedUrl)}`
        );

        // Set the response data into state
        const { categories, last_analysis_stats, last_analysis_results } =
          reportData.data.attributes;

        // Set the sorted data to the state
        setAnalysisData({
          screenshot,
          categories,
          lastAnalysisStats: last_analysis_stats,
          lastAnalysisResults: last_analysis_results,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error processing request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return { analyzeUrl, analysisData, loading };
};

export default useUrlAnalysis;
