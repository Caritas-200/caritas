import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure this imports your Tailwind CSS styles

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caritas",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
