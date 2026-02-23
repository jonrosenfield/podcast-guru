import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Podcast Guru — FYF Marketing Studio",
  description: "AI-powered podcast marketing for F Your Feelings. Generate YouTube titles, descriptions, thumbnails, social captions, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
