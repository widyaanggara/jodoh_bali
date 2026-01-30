import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

<<<<<<< HEAD
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
=======
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jodoh Bali - Cinta Sejati Berdasarkan Tradisi",
<<<<<<< HEAD
  description: "Temukan pasangan yang berbagi nilai spiritual, budaya, dan kecintaan pada warisan leluhur Bali.",
=======
  description: "Temukan kecocokan pasangan dan jodoh ideal berdasarkan kalender tradisional Bali.",
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
  keywords: ["jodoh bali", "wuku", "kalender bali", "kecocokan pasangan", "ramalan jodoh"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
<<<<<<< HEAD
        className={`${playfair.variable} ${jakarta.variable} antialiased`}
=======
        className={`${playfair.variable} ${plusJakarta.variable} antialiased font-sans`}
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
      >
        {children}
      </body>
    </html>
  );
}
