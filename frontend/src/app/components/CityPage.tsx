import { useState, useEffect } from "react";
import { MapPin, Search, ArrowLeft } from "lucide-react";
import { SEO } from "./SEO";
import { breadcrumbSchema } from "../lib/schemas";
import { Button } from "./ui/button";
import { ImgWithFallback } from "./ui/img-with-fallback";
import { getCities, getProperties } from "../services/properties";
import type { CityResponse, PropertyResponse } from "../types/api";

const CITY_ALIASES: Record<string, string> = {
  "cholpon-ata": "Чолпон-Ата",
  "bosteri": "Бостери",
  "kara-oy": "Кара-Ой",
  "chok-tal": "Чок-Тал",
  "tamchy": "Тамчы",
};

interface CityPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  citySlug?: string;
}

export function CityPage({ onNavigate, citySlug }: CityPageProps) {
  const [city, setCity] = useState<CityResponse | null>(null);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = city?.name || CITY_ALIASES[citySlug || ""] || citySlug || "Иссык-Куль";
  const cityName = displayName;
  const slug = citySlug || "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cities = await getCities();
        const matched = cities.find((c) => c.slug === slug);
        if (matched) {
          setCity(matched);
          const res = await getProperties({ city_id: matched.id, limit: "50" });
          setProperties(res.items);
        } else {
          const display = CITY_ALIASES[slug] || slug;
          const res = await getProperties({ query: display, limit: "50" });
          setProperties(res.items);
        }
      } catch {
        const display = CITY_ALIASES[slug] || slug;
        try {
          const res = await getProperties({ query: display, limit: "50" });
          setProperties(res.items);
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  const filtered = searchQuery
    ? properties.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.city?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : properties;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <SEO
        title={`Жильё в ${cityName} — отдых на Иссык-Куле, Кыргызстан`}
        description={`Лучшие отели, коттеджи, юрты и гостевые дома в ${cityName} на Иссык-Куле, Кыргызстан. ${properties.length > 0 ? `${properties.length} вариантов жилья.` : ""} Бронируйте онлайн, реальные отзывы, лучшие цены.`}
        canonical={`/city/${slug}`}
        image={properties[0]?.images?.[0]}
        jsonLd={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: `Курорт ${cityName}`, url: `/city/${slug}` },
        ])}
      />

      <div className="py-10 px-4" style={{ background: "linear-gradient(135deg, var(--lake-blue-dark) 0%, var(--lake-blue) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <button onClick={() => onNavigate("landing")} className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} /> На главную
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            {cityName}
          </h1>
          <p className="text-white/80 text-lg">Отдых на Иссык-Куле — лучшие предложения в {cityName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <Search size={18} style={{ color: "var(--lake-blue)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, описанию..."
              className="w-full text-sm outline-none bg-transparent"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <Button onClick={() => onNavigate("search", { query: searchQuery || cityName })} style={{ background: "var(--lake-blue)" }}>
            Найти
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Нет объявлений</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>В {cityName} пока нет доступных вариантов. Попробуйте поискать в других городах.</p>
            <button onClick={() => onNavigate("search")} className="mt-4 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Поискать на всём Иссык-Куле
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Найдено {filtered.length} вариантов
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
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
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{listing.city?.name || cityName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base" style={{ color: "var(--lake-blue)" }}>
                        {listing.price_per_night.toLocaleString()} Сом / ночь
                      </span>
                      {listing.stages > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--lake-blue-light)", color: "var(--lake-blue)" }}>
                          ★ {listing.rating_points.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
