import { NextResponse } from "next/server";

// OCR Optical character recognition - Image to Text Feature Route
export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      throw new Error("No file provided or invalid file format.");
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

    if (!response.ok) {
      throw new Error("OCR API request failed");
    }

    const data = await response.json();

    const parsedText = data.ParsedResults[0].ParsedText;

    // Check if the parsedResults exist and are in the expected structure
    if (
      !data.ParsedResults ||
      !Array.isArray(data.ParsedResults) ||
      data.ParsedResults.length === 0
    ) {
      throw new Error(
        "No parsed text found in the OCR response. Please ensure the image is clear."
      );
    }

    if (!parsedText) {
      throw new Error(
        "The URL could not be extracted from the image. Please ensure the image is clear."
      );
    }

    return new NextResponse(JSON.stringify({ parsedText }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred during OCR processing.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
