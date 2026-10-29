import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = "https://epha-creative-portfolio-o6pwciqn4-eeyob1997-ux.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EPHA Creative | Graphic Design & Video Editing",
    template: "%s | EPHA Creative",
  },
  description:
    "Explore EPHA Creative's graphic design, branding, posters, social media creatives, and video editing portfolio for clients in Ethiopia and worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "EPHA Creative",
    title: "EPHA Creative | Graphic Design & Video Editing",
    description:
      "Creative graphic design, branding, social media design, and video editing for clients in Ethiopia and worldwide.",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
