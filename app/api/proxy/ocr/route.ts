import { NextResponse } from "next/server";

// @desc OCR Optical character recognition - Image to Text Feature Route
// @route GET /api/proxy/ocr
// @access Public
export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      return new NextResponse(
        JSON.stringify({
          message: "No file provided or invalid file format.",
        }),
        { status: 415 } // 415 Unsupported Media Type is better when file format is incorrect
      );
    }

    const apiUrl = "https://api.ocr.space/parse/image";

    const url = new URL(apiUrl);
    url.searchParams.append("OCREngine", "2");

    const body = new FormData();
    body.append("file", file);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        apikey: process.env.OCR_API_KEY!,
      },
      body,
    });

    if (response.status === 504) {
      return new NextResponse(
        JSON.stringify({
          message:
            "The OCR service is taking longer than expected to process the file. Please try again later. If the issue persists, it could be due to temporary service disruptions.",
        }),
        { status: 504 } // 504 Gateway Timeout
      );
    }

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({
          message: "OCR API request failed",
        }),
        { status: 502 } // 502 Bad Gateway is better for an API failure
      );
    }

    const data = await response.json();

    const parsedText = data.ParsedResults[0].ParsedText;

    // Check if the parsedResults exist and are in the expected structure
    if (
      !data.ParsedResults ||
      !Array.isArray(data.ParsedResults) ||
      data.ParsedResults.length === 0
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "No parsed text found in the OCR response. Please make sure the image is clear and contains text.",
        }),
        { status: 422 } // 422 Unprocessable Entity is more appropriate when no parsed results are found
      );
    }

    if (!parsedText) {
      return new NextResponse(
        JSON.stringify({
          message:
            "No URL could be extracted from the image. Please ensure the image is clear and contains a URL.",
        }),
        { status: 422 } // 422 Unprocessable Entity as it's a validation issue with the extracted content
      );
    }

    return new NextResponse(JSON.stringify({ parsedText }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      "An error occurred during OCR processing." + error.message,
      {
        status: 500, // 500 Internal Server Error is correct
      }
    );
  }
};
