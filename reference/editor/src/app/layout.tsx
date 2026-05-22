import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCF Editor — Open Career Format",
  description: "Edit your Open Career Format master file",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
