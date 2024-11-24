import { base64EncodeUrl } from "@/helpers/urlUtils";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return new NextResponse(
        JSON.stringify({
          message: "URL is required",
        }),
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return new NextResponse(
        JSON.stringify({
          message: "Please enter a valid URL (must start with http or https)",
        }),
        { status: 400 }
      );
    }

    // Set up the VirusTotal API request URL
    const apiUrl = `https://www.virustotal.com/api/v3/urls/${base64EncodeUrl(
      url
    )}`;

    // Make the request using fetch
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-apikey": process.env.VIRUS_TOTAL_API_KEY!, // Set your API key in .env
      },
    });

    if (!response.ok) {
      throw new Error(
        "The website could not be accessed. It may be temporarily down or no longer available."
      );
    }

    const data = await response.json();

    // Return the VirusTotal response to the client
    return new NextResponse(
      JSON.stringify({
        message: "URL Analysis Complete",
        data: data.data,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to fetch VirusTotal data",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
