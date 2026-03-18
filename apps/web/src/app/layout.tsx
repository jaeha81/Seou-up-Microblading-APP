import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seou-up Microblading",
  description:
    "Seou-up Microblading — Information and visualization support platform. " +
    "Not a licensed medical or procedure provider.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
