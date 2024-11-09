import type { Metadata } from "next";
import { VT323 } from "next/font/google";
// import localFont from "next/font/local";
import "./globals.css";

const gameFont = VT323({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Text RPG AI",
  description: "Text RPG AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gameFont.className}  antialiased bg-black text-white  `}
      >
        {children}
      </body>
    </html>
  );
}
