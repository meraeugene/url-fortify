"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthenticatedUserData } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

type FloatingNavProps = {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  isAuth: boolean;
  authenticatedUserData: AuthenticatedUserData;
};

export const FloatingNav = ({
  navItems,
  className,
  authenticatedUserData,
  isAuth,
}: FloatingNavProps) => {
  const { scrollYProgress } = useScroll();

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);

  // Hide navbar after 1 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        // also set false for the initial state when it is at the top of the page
        setVisible(false);
      } else {
        if (direction < 0) {
          // only show when user is scrolling up
          setVisible(true);
        } else {
          // hide when user is scrolling down
          setVisible(false);
        }
      }
    }
  });

  // Get the set user data from Zustand store
  // const setUserData = useUserStore((state) => state.setUserData);

  // Save data to Zustand store
  // setUserData(authenticatedUserData);

  // GOOGLE AUTH
  const router = useRouter();
  const { toast } = useToast();

  const { user } = authenticatedUserData || {};

  // Loader state
  const [loading, setLoading] = useState(false);

  const googleLoginAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth(app);

    try {
      setLoading(true);

      // Start Google login and fetch in parallel (after sign-in)
      const signInPromise = signInWithPopup(auth, new GoogleAuthProvider());

      // Wait for the sign-in to complete, but avoid blocking UI updates
      const { user } = await signInPromise;
      const { displayName, email, photoURL } = user;

      // Start the fetch request while the sign-in process completes
      const responsePromise = fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: displayName, email, photoURL }),
      });

      // Wait for the fetch response
      const response = await responsePromise;

      // Check response status and throw error if necessary
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.message || "An error occurred during login";
        throw new Error(errorMessage);
      }

      // Successfully logged in
      const data = await response.json();

      // Redirect to the appropriate URL
      router.push(data.redirectURL);
    } catch (error: any) {
      console.log(error);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message;
        throw new Error(errorMessage);
      }

      // Successfully logged out
      const data = await response.json();
      router.push(data.redirectURL);
    } catch (error: any) {
      console.log(error);
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          // change rounded-full to rounded-lg
          // remove dark:border-white/[0.2] dark:bg-black bg-white border-transparent
          // change  pr-2 pl-8 py-2 to px-10 py-5
          "flex max-w-fit  lg:min-w-fit fixed z-[100] top-10 inset-x-0 mx-auto px-6 lg:px-8 py-4 lg:py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-6  text-sm dark:hover:text-neutral-300 hover:text-neutral-500",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center  flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            {/* add !cursor-pointer */}
            {/* remove hidden sm:block for the mobile responsive */}
            <span className=" text-sm !cursor-pointer">{navItem.name}</span>
          </Link>
        ))}

        {isAuth ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src={user.image}
                  width={28}
                  height={28}
                  className="rounded-full "
                  alt="profile picture"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/account/overview">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : loading ? (
          <Image src="/loader.svg" width={30} height={30} alt="loader" />
        ) : (
          <form onSubmit={googleLoginAuth}>
            <button
              type="submit"
              disabled={loading}
              className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full cursor-pointer"
            >
              <span>Login</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
