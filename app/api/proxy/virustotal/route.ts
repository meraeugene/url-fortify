import { base64EncodeUrl } from "@/helpers/urlUtils";
import { NextResponse } from "next/server";

// @desc Virust Total
// @route GET /api/proxy/virustotal
// @access Public
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return new NextResponse(
        JSON.stringify({
          message: "URL is required",
        }),
        { status: 400 } // 400 Bad Request is appropriate for missing URL
      );
    }

    if (typeof url !== "string" || !url.startsWith("http")) {
      return new NextResponse(
        JSON.stringify({
          message: "Please enter a valid URL (must start with http or https",
        }),
        { status: 400 } // 400 Bad Request for invalid URL format
      );
    }

    const apiUrl = `https://www.virustotal.com/api/v3/urls/${base64EncodeUrl(
      url
    )}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-apikey": process.env.VIRUS_TOTAL_API_KEY!,
      },
    });

    if (response.status === 504) {
      return new NextResponse(
        JSON.stringify({
          message:
            "The VirusTotal API is currently taking longer than expected to respond. Please try again in a few moments. If this issue persists, it may indicate temporary service disruptions.",
        }),
        { status: 504 } // 504 Gateway Timeout
      );
    }

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({
          message:
            "The website could not be accessed. It may be temporarily down or no longer available.",
        }),
        { status: 502 } // 502 Bad Gateway is more appropriate for external service issues
      );
    }

    // if no user (guest user) or user plan is "Fortify Free" dont return the const { categories, last_analysis_stats, last_analysis_results } = data.attributes;

    const data = await response.json();

    return new NextResponse(
      JSON.stringify({
        message: "URL Analysis Complete",
        data: data.data,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Failed to fetch VirusTotal data" + error.message, {
      status: 500, // 500 Internal Server Error for unexpected issues
    });
  }
};
