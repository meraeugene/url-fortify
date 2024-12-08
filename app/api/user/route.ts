import { getUser, verifySession } from "@/lib/dal";
import { connect } from "@/lib/db";
import User from "@/lib/models/userModel";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

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

// @desc Get user profile
// @route GET /api/user
// @access Private
export const GET = async () => {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    console.error("Error getting profile:", error);
    return new NextResponse(
      JSON.stringify({
        message: error.message,
        error: error.error,
      }),
      { status: 500 }
    );
  }
};

// @desc Update user profile
// @route PATCH /api/user
// @access Private
export const PATCH = async (request: Request) => {
  try {
    // Verify user session
    const session = await verifySession();
    if (!session.isAuth || !session.userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(session.userId)) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Parse the request body
    const formData = await request.formData();
    const newFullName = formData.get("fullName")?.toString();
    const newEmail = formData.get("email")?.toString();
    const imageFile = formData.get("image") as File | null;

    // Connect to the database
    await connect();

    // Find user
    const user = await User.findById(session.userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    let imageUrl = user.image;

    // Handle image upload if a file is provided
    if (imageFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSizeInBytes = 1048576; // 1MB

      if (!allowedTypes.includes(imageFile.type)) {
        return new NextResponse(
          JSON.stringify({
            message:
              "File type not allowed. Only JPG, PNG, and WEBP formats are allowed.",
          }),
          { status: 400 }
        );
      }

      if (imageFile.size > maxSizeInBytes) {
        return new NextResponse(
          JSON.stringify({
            message: "File size too large. File size must not exceed 1MB.",
          }),
          { status: 400 }
        );
      }

      const imageKey = `users/${session.userId}/${uuidv4()}-${imageFile.name}`;
      const buffer = await imageFile.arrayBuffer();

      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: Buffer.from(buffer),
        ContentType: imageFile.type,
      });

      await s3Client.send(uploadCommand);

      // Generate the URL for the uploaded image
      imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${imageKey}`;
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      {
        fullName: newFullName || user.fullName,
        email: newEmail || user.email,
        image: imageUrl,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Profile updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return new NextResponse(
      JSON.stringify({
        message: error.message,
        error: error.error,
      }),
      { status: 500 }
    );
  }
};
