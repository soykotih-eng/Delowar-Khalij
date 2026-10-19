import { Cairo, Plus_Jakarta_Sans } from "next/font/google";

// Shared by the public site and the admin panel layouts.
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
export const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap", preload: false });
