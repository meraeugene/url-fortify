import { NextResponse } from "next/server";

// OCR Optical character recognition - Image to Text Feature Route
export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      return new NextResponse(
        JSON.stringify({ message: "No file provided or invalid file format." }),
        { status: 400 }
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
      return new NextResponse(
        JSON.stringify({
          message:
            "No parsed text found in the OCR response. Please ensure the image is clear.",
        }),
        { status: 400 }
      );
    }

    if (!parsedText) {
      return new NextResponse(
        JSON.stringify({
          message:
            "The image could not be processed. Please ensure the image contains readable text.",
        }),
        { status: 400 }
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
