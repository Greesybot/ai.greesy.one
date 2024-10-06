import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";
import SessionWrapper from "./components/SessionWrapper";

import Nav from "./components/Main/MobileNav";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreesyAI",
  description: "AI for Everyone",
  keywords: ["ai", "gpt", "chatgpt", "claude", "gemini", "deepseek", "llma"],
  robots: "noindex, nofollow",
  charset: "utf-8",
  language: "English",
  revisitAfter: "2 days",
  author: "GreesyAI",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SessionWrapper>
        <html lang="en">
          <body className={`${inter.className}`}>{children}</body>
        </html>
      </SessionWrapper>
    </>
  );
}