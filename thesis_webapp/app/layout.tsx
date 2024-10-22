import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/NavBar/NavBar";
import { ExtractedTextProvider } from "./Components/Contexts/ExtractedTextContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Law Philippines",
  description: "AI-based Search System for Philippine Legal Documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ExtractedTextProvider>{children}</ExtractedTextProvider>
      </body>
    </html>
  );
}
