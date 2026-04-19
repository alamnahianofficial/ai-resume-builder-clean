import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Create ATS-optimized resumes with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white antialiased">
        {/* Global Wrapper */}
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
}
