import { Roboto } from "next/font/google";

export const fontSans = Roboto({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-roboto",
});
