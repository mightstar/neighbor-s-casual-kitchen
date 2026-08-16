import { restaurant, siteUrl } from "@/lib/restaurant";

export function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    url: siteUrl,
    telephone: restaurant.phone,
    servesCuisine: restaurant.cuisines,
    priceRange: restaurant.priceSymbol,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.city,
      addressRegion: restaurant.address.state,
      postalCode: restaurant.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.8806,
      longitude: -96.7186,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday"], opens: "11:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday", "Friday"], opens: "11:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "21:00" },
    ],
    acceptsReservations: true,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
