import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veloria – Fine Dining Restaurant",
  description:
    "Veloria is a premium fine dining restaurant offering curated breakfast, lunch, dinner and drinks in the heart of New York.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-veloria-black text-veloria-cream antialiased">
        {children}
      </body>
    </html>
  );
}
