'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/hero5-header";
import { ThemeProvider } from "@/components/theme-provider";
import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


import { useEffect } from "react";
import { ReduxProvider } from "@/redux/provider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchUser } from "@/redux/slices/userSlice";
import AuthLoader from "@/components/AuthLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //get current user
  // useEffect(() => {
  //   const fetchUser = async () => {

  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       console.warn('No token found');
  //       return;
  //     }

  //     try {
  //       // const token = localStorage.getItem('token') // or wherever you store your token

  //       const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/me', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })

  //       console.log('current user', response.data)
  //     } catch (error) {
  //       console.error('Error fetching user:', error)
  //     }
  //   }

  //   fetchUser()
  // }, [])




  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        // disableTransitionOnChange
        >
          <ReduxProvider>
            <AuthLoader />
            <HeroHeader />
            {children}
            {/* <FooterSection /> */}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
