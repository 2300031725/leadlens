import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadLens — Lead Quality Workspace",
  description: "Clean company data, understand lead fit, and export a focused shortlist.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
