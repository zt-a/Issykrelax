import { useState, useEffect } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { SEO } from "./SEO";
import { breadcrumbSchema } from "../lib/schemas";
import { ImgWithFallback } from "./ui/img-with-fallback";
import { getCategories, getProperties } from "../services/properties";
import type { CategoryResponse, PropertyResponse } from "../types/api";

interface CategoryPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  categorySlug?: string;
}

export function CategoryPage({ onNavigate, categorySlug }: CategoryPageProps) {
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const catName = category?.name || categorySlug || "Категория";
  const slug = categorySlug || "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cats = await getCategories();
        const matched = cats.find((c) => c.slug === slug);
        if (matched) {
          setCategory(matched);
          const res = await getProperties({ category_id: matched.id, limit: "50" });
          setProperties(res.items);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <SEO
        title={`${catName} на Иссык-Куле — бронирование, цены, отзывы`}
        description={`Лучшие ${catName.toLowerCase()} на Иссык-Куле, Кыргызстан. ${properties.length > 0 ? `${properties.length} вариантов.` : ""} Сравните цены, читайте отзывы, бронируйте онлайн. Отдых на Иссык-Куле с IssykRelax.`}
        canonical={`/category/${slug}`}
        image={properties[0]?.images?.[0]}
        jsonLd={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: catName, url: `/category/${slug}` },
        ])}
      />

      <div className="py-10 px-4" style={{ background: "linear-gradient(135deg, #0c4a6e 0%, var(--turquoise) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <button onClick={() => onNavigate("landing")} className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} /> На главную
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            {catName}
          </h1>
          <p className="text-white/80 text-lg">{category?.description || `Лучшие предложения ${catName.toLowerCase()} на Иссык-Куле`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Нет объявлений в этой категории</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Попробуйте поискать в других категориях.</p>
            <button onClick={() => onNavigate("search")} className="mt-4 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Поискать всё жильё
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((listing) => (
              <button
                key={listing.id}
                onClick={() => onNavigate("property", { property_id: listing.id })}
                className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <ImgWithFallback src={listing.images?.[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: "var(--text-primary)" }}>{listing.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={12} style={{ color: "var(--text-secondary)" }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{listing.city?.name || "Иссык-Куль"}</span>
                  </div>
                  <span className="font-bold text-base" style={{ color: "var(--lake-blue)" }}>
                    {listing.price_per_night.toLocaleString()} Сом / ночь
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
