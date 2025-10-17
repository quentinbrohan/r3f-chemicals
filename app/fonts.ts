import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
