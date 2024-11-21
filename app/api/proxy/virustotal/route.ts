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
      throw new Error(`Error fetching VirusTotal data: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the VirusTotal response to the client
    return new NextResponse(
      JSON.stringify({
        message: "Success",
        data: data.data,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      "Error in fetching result from virus total" + error.message,
      {
        status: 500,
      }
    );
  }
};
