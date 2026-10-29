import type { MetadataRoute } from "next";

const siteUrl = "https://epha-creative-portfolio-git-main-eeyob1997-ux.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}


