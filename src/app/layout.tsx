import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Playfair_Display, Caveat } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const siteUrl =
  "https://epha-creative-portfolio-o6pwciqn4-eeyob1997-ux.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  verification: {
    google: "Ak6TSKETfFYDkc7F3cUdxE--5JHy2gklVFOj0trhbec",
  },

  title: {
    default: "Creative Portfolio | Graphic Design & Video Editing",
    template: "%s | Creative Portfolio",
  },

  description:
    "Explore creative graphic design, branding, posters, social media creatives, and video editing portfolio for clients in Ethiopia and worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Creative Portfolio",
    title: "Creative Portfolio | Graphic Design & Video Editing",
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
      <head>
      </head>
      <body className={`${spaceGrotesk.variable} ${playfair.variable} ${caveat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
