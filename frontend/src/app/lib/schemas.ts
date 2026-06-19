const BASE_URL = "https://issykrelax.kg";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "IssykRelax",
    description: "Крупнейший маркетплейс отдыха на Иссык-Куле. Бронирование жилья, отелей, коттеджей, туров и ресторанов.",
    url: BASE_URL,
    image: `${BASE_URL}/logotip.png`,
    telephone: "+996XXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Issyk-Kul",
      addressCountry: "KG",
    },
    areaServed: {
      "@type": "State",
      name: "Issyk-Kul Region",
    },
    priceRange: "$$",
  };
}

export function vacationRentalSchema(property: {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  city?: string;
  rating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: property.title,
    description: property.description,
    url: `${BASE_URL}/property/${property.id}`,
    image: property.image || `${BASE_URL}/logotip.png`,
    priceRange: `${property.price} KGS`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city || "Иссык-Куль",
      addressCountry: "KG",
    },
    ...(property.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: property.rating,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function searchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
