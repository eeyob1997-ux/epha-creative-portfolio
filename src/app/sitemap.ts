import type { MetadataRoute } from "next";

const siteUrl = "https://epha-creative-portfolio-git-main-eeyob1997-ux.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

