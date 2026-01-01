import { MetadataRoute } from "next";

const siteUrl = "https://notevo.me/";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/privacy-policy",
    "/terms-of-service",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}

