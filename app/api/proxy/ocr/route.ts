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

    // Create the query parameters including OCREngine
    const url = new URL(apiUrl);
    url.searchParams.append("OCREngine", "2"); // Add OCREngine as a query parameter

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
      throw new Error("OCR API request failed.");
    }
    const data = await response.json();

    console.log(data);

    // Access the parsed text
    const parsedText = data.ParsedResults[0].ParsedText;

    return new NextResponse(JSON.stringify({ parsedText }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to fetch screenshot",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
