"use client"

import "./globals.css";
import NavBar from "@/components/NavBar";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { NavBarProvider } from "@/components/NavBarContext";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps extends AppProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBarProvider>
          <NavBar />
          {children}
        </NavBarProvider>
      </body>
    </html>
  );
}
