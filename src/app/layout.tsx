import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lic. Luciana Cresia - Nutricionista",
  description: "Agenda tu turno online de forma simple y rápida. Modalidad online o presencial.",
  manifest: '/manifest.json',
  openGraph: {
    title: "Lic. Luciana Cresia - Nutricionista",
    description: "Agenda tu turno online de forma simple y rápida. Modalidad online o presencial.",
    images: [
      {
        url: '/food-image.png',
        width: 1200,
        height: 630,
        alt: "Lic. Luciana Cresia - Nutricionista",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lic. Luciana Cresia - Nutricionista",
    description: "Agenda tu turno online de forma simple y rápida. Modalidad online o presencial.",
    images: ['/food-image.png'],
  },
  icons: {
    apple: "/logo-luci.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lic. Luciana Cresia - Nutricionista"
  },
  themeColor: "#00e362",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} notranslate antialiased`}
      >
        <ToastContainer position="top-center" autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
