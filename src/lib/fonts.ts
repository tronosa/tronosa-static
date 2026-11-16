import { Roboto } from "next/font/google";

export const fontSans = Roboto({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-roboto",
});
