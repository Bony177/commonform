import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import localFont from "next/font/local";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const humane = localFont({
  src: [
    {
      path: "../public/fonts/Humane-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Humane-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Font Preloading for instant loading */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/ClashDisplay-Regular.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Panchang-Bold.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Panchang-Extrabold.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff"
          href="/fonts/Galgo.woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Humane-Regular.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Humane-Bold.woff2"
          crossOrigin="anonymous"
        />

        {/* Image Preloading */}
        <link rel="preload" as="image" href="/images/background.jpg" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${poppins.className} antialiased texture-all-text`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
