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

    const apiUrl = "https://api.apiflash.com/v1/urltoimage";

    const params = {
      format: "webp", // Output format
      full_page: true, // Capture the full page
      no_ads: true, // Block ads on the page
      scroll_page: true, // Capture the entire scrollable page
      response_type: "json", // API returns a JSON response
      access_key: process.env.API_FLASH_ACCESS_KEY!, // Your API access key from .env
      url, // URL to capture
    };

    // Construct the full URL with parameters
    const urlWithParams = new URL(apiUrl);

    // Append the parameters to the URL
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof typeof params];
      urlWithParams.searchParams.append(key, String(value));
    });

    // Make the API request using fetch
    const response = await fetch(urlWithParams.toString());

    if (!response.ok) {
      throw new Error(`Error fetching screenshot: ${response.statusText}`);
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify({ screenshot: data.url }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

// export const GET = async (request: Request) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const url = searchParams.get("url");

//     if (!url) {
//       return new NextResponse(
//         JSON.stringify({
//           message: "URL is required",
//         }),
//         { status: 400 }
//       );
//     }

//     if (!url || typeof url !== "string" || !url.startsWith("http")) {
//       return new NextResponse(
//         JSON.stringify({
//           message: "Please enter a valid URL (must start with http or https)",
//         }),
//         { status: 400 }
//       );
//     }

//     const apiUrl = "https://api.screenshotone.com/take";

//     const params: {
//       format: string;
//       full_page: boolean;
//       block_ads: boolean;
//       url: string;
//       access_key: string;
//       store: boolean;
//       storage_path: string;
//       response_type: string;
//       storage_return_location: boolean;
//     } = {
//       format: "webp", // Output format
//       full_page: true, // Capture the full page
//       block_ads: true, // Block ads on the page
//       url,
//       access_key: process.env.SCREENSHOT_ONE_ACCESS_KEY!, // Your API access key
//       store: true,
//       storage_path: `screenshots/screenshot-${uuidv4()}`,
//       response_type: "empty", //return only status or error
//       storage_return_location: true, // Return the file location returned by S3.
//     };

//     // Construct full URL with parameters
//     const urlWithParams = new URL(apiUrl);

//     Object.keys(params).forEach((key) => {
//       const value = params[key as keyof typeof params];
//       urlWithParams.searchParams.append(key, String(value)); // Convert to string
//     });

//     // Log the full URL
//     console.log("Request URL with parameters:", urlWithParams.toString());

//     const response = await axios.get(apiUrl, { params });

//     const screenshotUrl = response.headers["x-screenshotone-store-location"];

//     return new NextResponse(
//       JSON.stringify({
//         screenshot: screenshotUrl,
//       }),
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.log(error);
//     return new NextResponse("Error in fetching users" + error.message, {
//       status: 500,
//     });
//   }
// };

// NO CODE API SCREENSHOT FOR BASE 64 FORMAT AND SAVING TO AWS
// export const POST = async (request: Request) => {
//   try {
//     const body = await request.json();
//     const { url, base64Format } = body;

//     if (!url || typeof url !== "string" || !url.startsWith("http")) {
//       return new NextResponse(
//         JSON.stringify({
//           message: "Please enter a valid URL (must start with http or https)",
//         }),
//         { status: 400 }
//       );
//     }

//     // Validate Base64 format
//     if (!base64Format || typeof base64Format !== "string") {
//       return new NextResponse(
//         JSON.stringify({
//           message: "Invalid base64 image format",
//         }),
//         { status: 400 }
//       );
//     }

//     //Convert Base64 to Buffer
//     const screenshotBuffer = Buffer.from(base64Format, "base64");

//     // Generate a unique filename for the screenshot
//     const screenshotKey = `screenshots/screenshot-${uuidv4()}.png`;

//     // Upload the screenshot to S3
//     const uploadParams = {
//       Bucket: bucketName!, // Replace with your S3 bucket name
//       Key: screenshotKey,
//       Body: screenshotBuffer,
//       ContentType: "image/png",
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));

//     const screenshotUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${screenshotKey}`;

//     return new NextResponse(
//       JSON.stringify({
//         message: "Screenshot success",
//         screenshot: screenshotUrl,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return new NextResponse(
//       JSON.stringify({
//         message: "Unable to access the specified URL",
//       }),
//       { status: 500 }
//     );
//   }
// };
