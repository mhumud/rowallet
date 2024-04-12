"use client"

import "./globals.css";
import NavBar from "@/components/NavBar";
import { NavBarProvider } from "@/components/NavBarContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Add NavBar context to the whole App */}
        <NavBarProvider>
          <NavBar />
          {children}
        </NavBarProvider>
      </body>
    </html>
  );
}
