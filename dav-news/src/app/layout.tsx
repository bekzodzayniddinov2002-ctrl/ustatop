import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dav News — qonunchilik tahlili",
  description: "Lex.uz hujjatlarini tahlil qilib, tuman miqyosidagi vazifalarni ajratuvchi AI agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
