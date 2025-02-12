
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/dashboard/page";
// import TaskBoard from "@/app/Taskboard/page";
// import Dash from "@/components/dashboard/home";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white` } 
      >
            <Navbar></Navbar>
            {/* <Dash></Dash> */}
            {/* <TaskBoard></TaskBoard>            */}
        {children}
      </body>
    </html>
  );
}
