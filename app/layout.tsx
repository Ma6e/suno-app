import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SunoFlow",
  description: "AI music generation studio",
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
