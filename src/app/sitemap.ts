import type { MetadataRoute } from "next";
import { menuItems } from "@/lib/menu";
import { siteUrl } from "@/lib/restaurant";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/menu", "/reserve", "/visit", "/about", "/cart", "/login", "/signup"];
  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...menuItems.map((item) => ({
      url: `${siteUrl}/menu/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
