import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DailyBites",
  description: "Your daily dose of productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
