"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import axios, { AxiosError } from "axios";

const GoogleLoginButton = () => {
  const googleLoginAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const { displayName, email, photoURL } = result.user;

      const response = await axios.post(
        "/api/auth/google",
        { fullName: displayName, email, image: photoURL },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("response", response);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={googleLoginAuth}>
      <button
        className="bg-white gap-2 rounded-lg text-black-100 flex items-center justify-center w-full mt-8 py-[0.65rem] hover:bg-gray-100"
        type="submit"
      >
        <Image
          src="/google-logo.svg"
          alt="google logo"
          width={24}
          height={24}
        />
        Continue with Google
      </button>
    </form>
  );
};

export default GoogleLoginButton;
