import { Montserrat } from "next/font/google";

export const fontSans = Montserrat({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-montserrat",
});
