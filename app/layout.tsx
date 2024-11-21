import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL-Fortify",
  description:
    "Fortify is a powerful tool designed to detect and intercept potentially malicious URLs, protecting users from phishing scams and ensuring safe browsing experiences.",
  openGraph: {
    images: [
      {
        url: "https://raw.githubusercontent.com/meraeugene/url-fortify/refs/heads/main/public/thumbnail.png",
      },
    ],
    description:
      "Fortify is a powerful tool designed to detect and intercept potentially malicious URLs, protecting users from phishing scams and ensuring safe browsing experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/url-logo.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
