import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Food Tracker App V0.1.0",
  description: "Food Tracker for everybody",
  keywords: ["Food", "Tracker", "อาหาร", "ติดตาม"],
  icons: {
    icon: "/next.svg",
    shortcut: "/shortcut.png",
  },
  authors: [
    {
      name: "Adisorn Nangnoi",
      url: "https://github.com/AdisornNangnoi",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${prompt.className} flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 text-gray-100`}
      >
        <main className="flex-grow">{children}</main>
        <footer className="sticky bottom-0 text-center py-[10px] text-base md:text-lg text-gray-300 bg-gradient-to-t from-gray-900/70 to-transparent border-t border-gray-700">
          Created by Adisorn Nangnoi
          <br />
          Copyright &copy; 2025 Southeast Asia University
        </footer>
      </body>
    </html>
  );
}
