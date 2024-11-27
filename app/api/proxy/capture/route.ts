import { NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const region = process.env.AWS_S3_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

// Initialize the S3 client
const s3Client = new S3Client({
  region: region!,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

// API FLASH - Screenshot Capture Route
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
          message: "Please enter a valid URL (must start with http or https)",
        }),
        { status: 400 } // 400 Bad Request for invalid URL
      );
    }

    const apiUrl = "https://api.apiflash.com/v1/urltoimage";
    const accessKey = process.env.API_FLASH_ACCESS_KEY;

    if (!accessKey) {
      return new NextResponse(
        JSON.stringify({
          message: "API key is missing",
        }),
        { status: 401 } // 401 Unauthorized for missing API key
      );
    }

    const params = {
      format: "webp",
      full_page: true,
      no_ads: true,
      scroll_page: true,
      response_type: "json",
      access_key: accessKey,
      wait_until: "network_idle",
      url,
      delay: 5,
    };

    const urlWithParams = new URL(apiUrl);

    Object.keys(params).forEach((key) => {
      const value = params[key as keyof typeof params];
      urlWithParams.searchParams.append(key, String(value));
    });

    const response = await fetch(urlWithParams.toString());

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({
          message:
            "The website could not be accessed. It is temporarily down or no longer available.",
        }),
        { status: 502 } // 502 Bad Gateway for external service failure
      );
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify({ screenshot: data.url }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Failed to fetch screenshot" + error.message, {
      status: 500, // 500 Internal Server Error for unexpected issues
    });
  }
};
