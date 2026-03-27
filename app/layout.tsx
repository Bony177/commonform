import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import localFont from "next/font/local";
import WaveBackground from "@/components/WaveBackground";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const humane = localFont({
  src: [
    {
      path: "../public/fonts/HUMANE-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HUMANE-Bold.woff2",
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
      <body className={`${poppins.className} antialiased`}>
        <WaveBackground />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
