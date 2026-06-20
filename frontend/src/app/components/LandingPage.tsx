import { useState, useEffect } from "react";
import {
  Search, MapPin, Star, ArrowRight, CheckCircle, ChevronLeft, ChevronRight,
  Waves, Tent, Hotel, Coffee, BedDouble, Home,
  Utensils, Compass, Dumbbell, Car, Backpack,
  Clock, Users, Shield, Zap, Building2,
} from "lucide-react";
import logotip from "@/assets/logo.png";
import { SEO } from "./SEO";
import { localBusinessSchema, searchActionSchema } from "../lib/schemas";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImgWithFallback } from "./ui/img-with-fallback";
import { getCategories, getProperties } from "../services/properties";
import { listRestaurantsApi } from "../services/restaurants-service";
import { listTours } from "../services/guides";
import { listActivities } from "../services/activities";
import { listTransfers } from "../services/drivers";
import { listTourPackages } from "../services/agency";
import type {
  CategoryResponse, PropertyResponse,
  RestaurantResponse, TourResponse,
  ActivityResponse, TransferResponse, TourPackageResponse,
} from "../types/api";

interface LandingPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  initialCategories?: CategoryResponse[];
  initialFeaturedProperties?: PropertyResponse[];
  initialRestaurants?: RestaurantResponse[];
  initialTours?: TourResponse[];
  initialActivities?: ActivityResponse[];
  initialTransfers?: TransferResponse[];
  initialTourPackages?: TourPackageResponse[];
}

const CATEGORY_ICONS: Record<string, { icon: typeof Hotel; color: string }> = {
  "Отель": { icon: Hotel, color: "var(--lake-blue)" },
  "Коттедж": { icon: BedDouble, color: "#7c3aed" },
  "Курорт": { icon: Waves, color: "var(--turquoise)" },
  "Юрта": { icon: Tent, color: "#d97706" },
  "Гостевой дом": { icon: Coffee, color: "#dc2626" },
};
const DEFAULT_ICON = { icon: Home, color: "#64748b" };

const SERVICE_LINKS = [
  { page: "restaurants", icon: Utensils, label: "Рестораны", desc: "Национальная и европейская кухня", color: "#dc2626", bg: "#fef2f2" },
  { page: "tours", icon: Compass, label: "Туры", desc: "Экскурсии по Иссык-Кулю и горам", color: "#0891b2", bg: "#ecfeff" },
  { page: "activities", icon: Dumbbell, label: "Активный отдых", desc: "Водные виды спорта, треккинг", color: "#7c3aed", bg: "#f5f3ff" },
  { page: "transfers", icon: Car, label: "Трансферы", desc: "Встреча из аэропорта и поездки", color: "#ea580c", bg: "#fff7ed" },
  { page: "tour-packages", icon: Backpack, label: "Пакетные туры", desc: "Готовые решения с жильём и питанием", color: "#16a34a", bg: "#f0fdf4" },
];

const TESTIMONIALS = [
  { name: "Алина Сейткали", city: "Алматы, Казахстан", text: "Нашли идеальный коттедж на берегу за 10 минут! Сервис просто отличный, вернёмся снова.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop" },
  { name: "Дмитрий Козлов", city: "Москва, Россия", text: "Впервые на Иссык-Куле — и сразу в восторге. IssykRelax помог организовать всё: жильё, туры, транспорт.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop" },
  { name: "Нодира Юсупова", city: "Ташкент, Узбекистан", text: "Юрт-кемп — это что-то невероятное. Рекомендую всем, кто хочет настоящего отдыха на природе.", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop" },
];

const VEHICLE_EMOJI: Record<string, string> = {
  sedan: "🚗", minivan: "🚐", bus: "🚌", suv: "🚙", premium: "🚘",
};
const CUISINE_FLAG: Record<string, string> = {
  "Кыргызская": "🇰🇬", "Европейская": "🇪🇺", "Узбекская": "🇺🇿",
  "Азиатская": "🍜", "Кавказская": "🥩", "Итальянская": "🍝",
};

export function LandingPage({
  onNavigate,
  initialCategories,
  initialFeaturedProperties,
  initialRestaurants,
  initialTours,
  initialActivities,
  initialTransfers,
  initialTourPackages,
}: LandingPageProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>(initialCategories || []);
  const [featured, setFeatured] = useState<PropertyResponse[]>(initialFeaturedProperties || []);
  const [restaurants, setRestaurants] = useState<RestaurantResponse[]>(initialRestaurants || []);
  const [tours, setTours] = useState<TourResponse[]>(initialTours || []);
  const [activities, setActivities] = useState<ActivityResponse[]>(initialActivities || []);
  const [transfers, setTransfers] = useState<TransferResponse[]>(initialTransfers || []);
  const [packages, setPackages] = useState<TourPackageResponse[]>(initialTourPackages || []);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [destIdx, setDestIdx] = useState(0);

  const hasInitialData = initialCategories && initialFeaturedProperties && initialRestaurants
    && initialTours && initialActivities && initialTransfers && initialTourPackages;

  useEffect(() => {
    if (hasInitialData) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const [cats, props, rests, ts, acts, trs, pkgs] = await Promise.all([
          getCategories(),
          getProperties({ limit: "4", max_price: 50000 }),
          listRestaurantsApi(undefined, 0, 3),
          listTours(undefined, 0, 3),
          listActivities(undefined, 0, 3),
          listTransfers(undefined, 0, 3),
          listTourPackages(0, 3),
        ]);
        setCategories(cats);
        setFeatured(props.items);
        setRestaurants(rests.items);
        setTours(ts.items);
        setActivities(acts.items);
        setTransfers(trs.items);
        setPackages(pkgs.items);
      } catch (err) {
        console.error("Failed to load landing data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    onNavigate("search", { query: searchQuery || undefined });
  }

  const cityCounts = [
    { name: "Чолпон-Ата", slug: "cholpon-ata", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Бостери", slug: "bosteri", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80&sat=-30" },
    { name: "Кара-Ой", slug: "kara-oy", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop" },
    { name: "Чок-Тал", slug: "chok-tal", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=300&fit=crop" },
    { name: "Тамчы", slug: "tamchy", image: "https://images.unsplash.com/photo-1482192505345-5852bda519bb?w=400&h=300&fit=crop" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <SEO
        title="Отдых на Иссык-Куле — бронирование жилья, отелей, туров, ресторанов и трансферов"
        description="IssykRelax — крупнейший маркетплейс отдыха на Иссык-Куле. Бронируйте жильё, отели, коттеджи, юрты, туры, рестораны, трансферы и активный отдых в Чолпон-Ате, Бостери, Кара-Ое. Лучшие цены, реальные отзывы."
        canonical="/"
        jsonLd={[localBusinessSchema(), searchActionSchema()]}
      />

      {/* ────── HERO ────── */}
      <section className="relative min-h-[600px] flex items-center" style={{ background: "linear-gradient(135deg, #0a3a5c 0%, #1a6fa8 50%, #0cb8b6 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop" alt="Иссык-Куль — жемчужина Кыргызстана" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center text-white mb-10">
            <Badge className="mb-4 text-sm px-4 py-1" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              🏔️ №1 маркетплейс Иссык-Куля
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", lineHeight: 1.15 }}>
              Откройте Иссык-Куль<br />по-новому
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">Коттеджи, отели, рестораны, туры и экскурсии — всё в одном месте</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <Search size={20} style={{ color: "var(--lake-blue)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск жилья, туров, ресторанов... Чолпон-Ата, коттедж, юрта, пляж..."
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl font-semibold text-sm text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--lake-blue), var(--turquoise))" }}
              >
                Найти
              </button>
            </form>

            <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
              {["Пляж", "Юрты", "Горы", "Семьям", "С питанием", "SPA"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onNavigate("search", { query: tag })}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────── CATEGORIES ────── */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Найдите всё для отдыха</h2>
          <p style={{ color: "var(--text-secondary)" }}>От жилья до экскурсий — всё в одном приложении</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
          {categories.map((cat) => {
            const c = CATEGORY_ICONS[cat.name] || DEFAULT_ICON;
            const CatIcon = c.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate("search", { category_id: cat.id })}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:shadow-md group-hover:scale-105" style={{ background: `${c.color}18`, border: `1.5px solid ${c.color}30` }}>
                  <CatIcon size={24} style={{ color: c.color }} />
                </div>
                <span className="text-xs md:text-sm font-medium text-center" style={{ color: "var(--text-primary)" }}>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ────── QUICK SERVICE LINKS ────── */}
      <section className="pb-14 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Все услуги для вашего отдыха</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Пять шагов к идеальному отпуску на Иссык-Куле</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SERVICE_LINKS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.page}
                onClick={() => onNavigate(s.page)}
                className="group text-center p-6 rounded-2xl border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: s.bg, color: s.color }}>
                  <Icon size={26} />
                </div>
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                <div className="text-xs mt-1 leading-snug" style={{ color: "var(--text-secondary)" }}>{s.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ────── RESTAURANTS ────── */}
      <section className="py-14 px-4" style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                <Utensils size={22} className="inline mr-2" style={{ color: "#dc2626" }} />
                Лучшие рестораны
              </h2>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>От бешбармака до европейских деликатесов</p>
            </div>
            <button onClick={() => onNavigate("restaurants")} className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Все рестораны <ArrowRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>Рестораны скоро появятся</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onNavigate("restaurant", { restaurant_id: r.id })}
                  className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <ImgWithFallback
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {r.price_range && (
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.9)", color: "var(--text-primary)" }}>
                          {r.price_range}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{r.name}</h3>
                    <div className="flex items-center gap-1 flex-wrap">
                      {r.cuisine_type && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef2f2", color: "#dc2626" }}>
                          {CUISINE_FLAG[r.cuisine_type] || ""} {r.cuisine_type}
                        </span>
                      )}
                    </div>
                    {r.city?.name && (
                      <div className="flex items-center gap-1 mt-2">
                        <MapPin size={11} style={{ color: "var(--text-secondary)" }} />
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.city.name}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 text-center md:hidden">
            <button onClick={() => onNavigate("restaurants")} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Все рестораны <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ────── TOURS ────── */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              <Compass size={22} className="inline mr-2" style={{ color: "#0891b2" }} />
              Экскурсии и туры
            </h2>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Путешествия по жемчужине Кыргызстана</p>
          </div>
          <button onClick={() => onNavigate("tours")} className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
            Все туры <ArrowRight size={16} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>Туры скоро появятся</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {tours.map((t) => (
              <button
                key={t.id}
                onClick={() => onNavigate("tour", { tour_id: t.id })}
                className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <ImgWithFallback
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                    <span className="text-white font-bold text-lg">{t.price.toLocaleString()} Сом</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{t.title}</h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="flex items-center gap-1"><Clock size={12} />{t.duration_days} {t.duration_days === 1 ? "день" : "дней"}</span>
                    <span className="flex items-center gap-1"><Users size={12} />до {t.max_guests} чел.</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <button onClick={() => onNavigate("tours")} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
            Все туры <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ────── POPULAR DESTINATIONS ────── */}
      <section className="py-14 px-4" style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Популярные направления</h2>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Самые любимые места отдыха на озере</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDestIdx(Math.max(0, destIdx - 1))} className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-white" style={{ borderColor: "var(--border)" }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setDestIdx(Math.min(cityCounts.length - 4, destIdx + 1))} className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity" style={{ background: "var(--lake-blue)" }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cityCounts.map((dest) => (
              <button
                key={dest.name}
                onClick={() => onNavigate("city", { city_slug: dest.slug })}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ aspectRatio: "3/4" }}
              >
                <img src={dest.image} alt={`${dest.name} на Иссык-Куле`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,28,46,0.8) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <div className="text-white font-bold text-sm md:text-base">{dest.name}</div>
                  <div className="text-white/60 text-xs mt-0.5">Иссык-Куль, Кыргызстан</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ────── ACTIVITIES ────── */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              <Dumbbell size={22} className="inline mr-2" style={{ color: "#7c3aed" }} />
              Активный отдых
            </h2>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Адреналин и впечатления на весь отпуск</p>
          </div>
          <button onClick={() => onNavigate("activities")} className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
            Все активности <ArrowRight size={16} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>Активности скоро появятся</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {activities.map((a) => (
              <button
                key={a.id}
                onClick={() => onNavigate("activity", { activity_id: a.id })}
                className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <ImgWithFallback
                    src="https://images.unsplash.com/photo-1530866495561-507c9fa053fc?w=600&h=400&fit=crop"
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                    <span className="text-white font-bold text-lg">{a.price.toLocaleString()} Сом</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{a.title}</h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {a.duration_minutes && <span className="flex items-center gap-1"><Clock size={12} />{a.duration_minutes} мин</span>}
                    <span className="flex items-center gap-1"><Users size={12} />до {a.max_participants} чел.</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <button onClick={() => onNavigate("activities")} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
            Все активности <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ────── TRANSFERS ────── */}
      <section className="py-14 px-4" style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                <Car size={22} className="inline mr-2" style={{ color: "#ea580c" }} />
                Трансферы
              </h2>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Комфортные поездки по всему побережью</p>
            </div>
            <button onClick={() => onNavigate("transfers")} className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Все трансферы <ArrowRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>Трансферы скоро появятся</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {transfers.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => onNavigate("transfer", { transfer_id: tr.id })}
                  className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}
                >
                  <div className="relative h-36 overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)" }}>
                    <span className="text-6xl transition-transform group-hover:scale-110">{VEHICLE_EMOJI[tr.vehicle_type || "sedan"] || "🚗"}</span>
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}>
                      <span className="text-white font-bold">{tr.price.toLocaleString()} Сом</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{tr.title}</h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="flex items-center gap-1"><MapPin size={11} />{tr.from_location}</span>
                      <ArrowRight size={11} />
                      <span className="flex items-center gap-1"><MapPin size={11} />{tr.to_location}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {tr.duration_minutes && <span className="flex items-center gap-1"><Clock size={11} />{tr.duration_minutes} мин</span>}
                      <span className="flex items-center gap-1"><Users size={11} />до {tr.max_passengers} чел.</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 text-center md:hidden">
            <button onClick={() => onNavigate("transfers")} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Все трансферы <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ────── TOUR PACKAGES ────── */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              <Backpack size={22} className="inline mr-2" style={{ color: "#16a34a" }} />
              Пакетные туры
            </h2>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Готовые решения для идеального отпуска</p>
          </div>
          <button onClick={() => onNavigate("tour-packages")} className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
            Все пакеты <ArrowRight size={16} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: "var(--text-secondary)" }}>Пакетные туры скоро появятся</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {packages.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate("tour-package", { package_id: p.id })}
                className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <ImgWithFallback
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.9)", color: "white" }}>
                      {p.duration_days} {p.duration_days === 1 ? "день" : "дней"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                    <span className="text-white font-bold text-lg">{p.price.toLocaleString()} Сом</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="flex items-center gap-1"><Users size={12} />до {p.max_guests} чел.</span>
                  </div>
                  {p.includes && (
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{p.includes}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <button onClick={() => onNavigate("tour-packages")} className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
            Все пакеты <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ────── FEATURED LISTINGS ────── */}
      <section className="py-14 px-4" style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Лучшие предложения</h2>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Отборные объекты с высоким рейтингом</p>
            </div>
            <button onClick={() => onNavigate("search")} className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
              Смотреть все <ArrowRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => onNavigate("property", { property_id: listing.id })}
                  className="group text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}
                >
                  <div className="relative overflow-hidden" style={{ height: 220 }}>
                    <ImgWithFallback
                      src={listing.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {listing.status === "active" && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--lake-blue)", color: "white" }}>
                          Доступно
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{listing.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin size={12} style={{ color: "var(--text-secondary)" }} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{listing.city?.name || "Иссык-Куль"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-base" style={{ color: "var(--lake-blue)" }}>{listing.price_per_night.toLocaleString()} Сом</span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}> / ночь</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────── STATS ────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Building2, value: `${featured.length}+`, label: "Объектов жилья", color: "var(--lake-blue)", bg: "var(--lake-blue-light)" },
            { icon: Utensils, value: `${restaurants.length}+`, label: "Ресторанов", color: "#dc2626", bg: "#fef2f2" },
            { icon: Compass, value: `${tours.length}+`, label: "Туров и экскурсий", color: "#0891b2", bg: "#ecfeff" },
            { icon: Car, value: `${transfers.length}+`, label: "Трансферов", color: "#ea580c", bg: "#fff7ed" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="p-6 rounded-2xl border text-center shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                  <Icon size={22} />
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</div>
                <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────── TESTIMONIALS ────── */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Что говорят путешественники</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl border shadow-sm" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="var(--sand)" stroke="var(--sand)" />)}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────── WHY US ────── */}
      <section className="py-14 px-4" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Почему выбирают IssykRelax</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Безопасное бронирование", desc: "Все объекты проходят проверку. Ваши данные под надёжной защитой." },
              { icon: Zap, title: "Мгновенное подтверждение", desc: "Бронируйте в один клик — подтверждение приходит моментально." },
              { icon: Star, title: "Реальные отзывы", desc: "Только настоящие гости могут оставлять отзывы. Никакой фальши." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--lake-blue-light)", color: "var(--lake-blue)" }}>
                    <Icon size={22} />
                  </div>
                  <div className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────── BUSINESS CTA ────── */}
      <section className="py-16 px-4 mx-4 md:mx-8 rounded-3xl mb-14 mt-14" style={{ background: "linear-gradient(135deg, var(--lake-blue-dark) 0%, var(--lake-blue) 60%, var(--turquoise) 100%)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Вы — владелец бизнеса?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Разместите свой объект на IssykRelax и получайте бронирования от тысяч туристов. Простая регистрация, удобная панель управления.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {["Бесплатное размещение", "Свой календарь брони", "Аналитика и доходы", "Верификация бизнеса"].map((feat) => (
              <div key={feat} className="flex items-center gap-2">
                <CheckCircle size={16} className="flex-shrink-0" style={{ color: "var(--turquoise-light)" }} />
                <span className="text-sm">{feat}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => onNavigate("add-listing")} className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:scale-105" style={{ background: "white", color: "var(--lake-blue)" }}>
              Разместить объект бесплатно
            </button>
            <button onClick={() => onNavigate("pricing")} className="px-8 py-3 rounded-xl font-semibold text-sm border transition-all" style={{ borderColor: "rgba(255,255,255,0.5)", color: "white" }}>
              Посмотреть тарифы
            </button>
          </div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logotip} alt="IssykRelax" className="h-8 w-auto" />
              <span className="font-bold text-lg" style={{ color: "var(--lake-blue)", fontFamily: "var(--font-display)" }}>IssykRelax</span>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Крупнейший маркетплейс для отдыха на Иссык-Куле. Находите жильё, рестораны, туры и транспорт. Бронируйте трансферы, экскурсии и пакетные туры.</p>
            <div className="flex gap-3">
              {["🇷🇺 RU", "🇺🇿 UZ", "🇰🇿 KZ", "🌍 EN"].map((lang) => <button key={lang} className="text-xs px-2 py-1 rounded" style={{ color: "var(--text-secondary)" }}>{lang}</button>)}
            </div>
          </div>
          {[
            {
              title: "Путешественникам",
              links: [
                { label: "Поиск жилья", page: "search" },
                { label: "Туры и экскурсии", page: "tours" },
                { label: "Рестораны", page: "restaurants" },
                { label: "Активный отдых", page: "activities" },
                { label: "Трансферы", page: "transfers" },
                { label: "Пакетные туры", page: "tour-packages" },
              ],
            },
            {
              title: "Владельцам",
              links: [
                { label: "Разместить объект", page: "add-listing" },
                { label: "Тарифы", page: "pricing" },
                { label: "Панель управления", page: "owner-dashboard" },
              ],
            },
            {
              title: "Компания",
              links: [
                { label: "О нас", page: "about" },
                { label: "Контакты", page: "feedback" },
                { label: "FAQ", page: "faq" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>{col.title}</div>
              <ul className="space-y-2">{col.links.map((link) => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-sm transition-colors hover:underline" style={{ color: "var(--text-secondary)" }}>
                    {link.label}
                  </button>
                </li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-2" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>© 2024 IssykRelax. Все права защищены.</span>
          <div className="flex gap-4">
            <button onClick={() => onNavigate("privacy")} className="text-xs" style={{ color: "var(--text-secondary)" }}>Политика конфиденциальности</button>
            <button onClick={() => onNavigate("terms")} className="text-xs" style={{ color: "var(--text-secondary)" }}>Условия использования</button>
            <button onClick={() => onNavigate("faq")} className="text-xs" style={{ color: "var(--text-secondary)" }}>FAQ</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
