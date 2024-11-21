import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "url-fortify-db",
      bufferCommands: true,
    });
    console.log("Connected to database");
  } catch (err: any) {
    console.log("Error: ", err);
  }
};
