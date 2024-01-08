"use client";
import "./globals.css";

//export const metadata = {
//  title: "Superlit",
//  description: "Superlit",
//};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="{inter.className} overflow-hidden">{children}</body>
    </html>
  );
}
