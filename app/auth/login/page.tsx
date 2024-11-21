import GoogleLoginButton from "@/components/GoogleLoginButton";
import MagicButton from "@/components/MagicButton";
import { InteractiveDiv } from "@/components/ui/MovingBorders";
import Image from "next/image";
import React from "react";

const LoginPage = () => {
  return (
    <div className="">
      <div className="relative   pt-10 lg:pt-20 flex items-center flex-col justify-center ">
        <div
          className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
        >
          {/* Radial gradient for the container to give a faded look */}
          <div
            className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
          />
        </div>

        <div className="relative justify-center items-center flex flex-col ">
          <Image
            src="/url-fortify-logo.png"
            alt="logo"
            width={130}
            height={130}
          />
          <h1 className="text-2xl md:text-4xl font-bold mb-8 ">
            Sign in to <span className="text-[#00ED82]">URL-Fortify</span>
          </h1>
        </div>
        <InteractiveDiv
          duration={Math.floor(Math.random() * 10000) + 10000}
          style={{
            background: "rgb(4,7,29)",
            backgroundColor:
              "linear-gradient(90deg, rgba(3, 59, 43, 1) 0%, rgba(0, 237, 130, 1) 100%)",
            borderRadius: `calc(1.75rem * 0.96)`,
          }}
          className="flex-1 text-white  border-slate-800  md:mx-auto md:w-[30rem] p-8 lg:p-12"
          otherClasses="lg:w-fit "
        >
          <div className="flex flex-col w-full">
            <form className="w-full">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm   text-gray-200"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="bg-slate-950 mt-[0.5rem] px-4 border border-[#539f7d] w-full h-10 rounded-lg focus:outline-none focus:border-[#00ff99]"
                />
              </div>
              <div className="w-full mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm   text-gray-200"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="bg-slate-950 px-4 mt-[0.5rem] border border-[#539f7d]  w-full h-10 rounded-lg focus:outline-none focus:border-[#00ff99]"
                />
              </div>

              <div className="mt-8">
                <MagicButton
                  title={"Sign in"}
                  position="right"
                  otherClasses="rounded-lg text-lg"
                  //   disabled={loading}
                />
              </div>
            </form>

            <div className="flex lg:flex-row flex-col items-center justify-center gap-3 lg:gap-2 mt-8">
              <div className="bg-[#252f3f] h-[1px] w-full " />
              <span className="w-full text-center text-white-100">
                Or continue with
              </span>
              <div className="bg-[#252f3f] h-[1px] w-full" />
            </div>

            {/* SIGN IN WITH GOOGLE */}
            <GoogleLoginButton />
          </div>
        </InteractiveDiv>
      </div>
    </div>
  );
};

export default LoginPage;
