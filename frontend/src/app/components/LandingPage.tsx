import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Star, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Waves, Tent, Hotel, Coffee, BedDouble, Home } from "lucide-react";
import logotip from "@/assets/logo.png";
import { SEO } from "./SEO";
import { localBusinessSchema, searchActionSchema } from "../lib/schemas";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImgWithFallback } from "./ui/img-with-fallback";
import { getCategories, getProperties } from "../services/properties";
import type { CategoryResponse, PropertyResponse } from "../types/api";

interface LandingPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const CATEGORY_ICONS: Record<string, { icon: typeof Hotel; color: string }> = {
  "Отель": { icon: Hotel, color: "var(--lake-blue)" },
  "Коттедж": { icon: BedDouble, color: "#7c3aed" },
  "Курорт": { icon: Waves, color: "var(--turquoise)" },
  "Юрта": { icon: Tent, color: "#d97706" },
  "Гостевой дом": { icon: Coffee, color: "#dc2626" },
};

const DEFAULT_ICON = { icon: Home, color: "#64748b" };



const TESTIMONIALS = [
  { name: "Алина Сейткали", city: "Алматы, Казахстан", text: "Нашли идеальный коттедж на берегу за 10 минут! Сервис просто отличный, вернёмся снова.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop" },
  { name: "Дмитрий Козлов", city: "Москва, Россия", text: "Впервые на Иссык-Куле — и сразу в восторге. IssykRelax помог организовать всё: жильё, туры, транспорт.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop" },
  { name: "Нодира Юсупова", city: "Ташкент, Узбекистан", text: "Юрт-кемп — это что-то невероятное. Рекомендую всем, кто хочет настоящего отдыха на природе.", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop" },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [featured, setFeatured] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [destIdx, setDestIdx] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [cats, props] = await Promise.all([
          getCategories(),
          getProperties({ limit: "4", max_price: 50000 }),
        ]);
        setCategories(cats);
        setFeatured(props.items);
      } catch (err) {
        console.error("Failed to load landing data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSearch() {
    onNavigate("search", {
      query: destination || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: guests || undefined,
    });
  }

  const cityCounts = [
    { name: "Чолпон-Ата", count: 0, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { name: "Бостери", count: 0, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80&sat=-30" },
    { name: "Кара-Ой", count: 0, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop" },
    { name: "Чок-Тал", count: 0, image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=300&fit=crop" },
    { name: "Тамчы", count: 0, image: "https://images.unsplash.com/photo-1482192505345-5852bda519bb?w=400&h=300&fit=crop" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <SEO
        title="Отдых на Иссык-Куле — бронирование жилья, отелей и туров в Кыргызстане"
        description="IssykRelax — крупнейший маркетплейс отдыха на Иссык-Куле, Кыргызстан. Бронируйте жильё, отели, коттеджи, юрты, туры и рестораны в Чолпон-Ате, Бостери, Кара-Ое. Лучшие цены, реальные отзывы, мгновенное бронирование."
        canonical="/"
        jsonLd={[localBusinessSchema(), searchActionSchema()]}
      />
      {/* Hero */}
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

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <MapPin size={18} style={{ color: "var(--lake-blue)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Куда</div>
                  <input type="text" placeholder="Чолпон-Ата, Бостери..." value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <Calendar size={18} style={{ color: "var(--lake-blue)" }} />
                <div className="flex-1">
                  <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Заезд</div>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <Calendar size={18} style={{ color: "var(--lake-blue)" }} />
                <div className="flex-1">
                  <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Выезд</div>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <Users size={18} style={{ color: "var(--lake-blue)" }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Гости</div>
                    <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full text-sm outline-none bg-transparent" style={{ color: "var(--text-primary)" }} />
                  </div>
                </div>
                <button onClick={handleSearch} className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, var(--lake-blue), var(--turquoise))" }}>
                  <Search size={20} color="white" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
              {["Пляж", "Юрты", "Горы", "Семьям", "С питанием", "SPA"].map((tag) => (
                <button key={tag} onClick={handleSearch} className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
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

      {/* Popular Destinations */}
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
                onClick={() => onNavigate("search", { query: dest.name })}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ aspectRatio: "3/4" }}
              >
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,28,46,0.8) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <div className="text-white font-bold text-sm md:text-base">{dest.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
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
      </section>



      {/* Testimonials */}
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

      {/* Business CTA */}
      <section className="py-16 px-4 mx-4 md:mx-8 rounded-3xl mb-14" style={{ background: "linear-gradient(135deg, var(--lake-blue-dark) 0%, var(--lake-blue) 60%, var(--turquoise) 100%)" }}>
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

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logotip} alt="IssykRelax" className="h-8 w-auto" />
              <span className="font-bold text-lg" style={{ color: "var(--lake-blue)", fontFamily: "var(--font-display)" }}>IssykRelax</span>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Крупнейший маркетплейс для отдыха на Иссык-Куле. Находите жильё, рестораны, туры и транспорт.</p>
            <div className="flex gap-3">
              {["🇷🇺 RU", "🇺🇿 UZ", "🇰🇿 KZ", "🌍 EN"].map((lang) => <button key={lang} className="text-xs px-2 py-1 rounded" style={{ color: "var(--text-secondary)" }}>{lang}</button>)}
            </div>
          </div>
          {[
            { title: "Путешественникам", links: ["Как это работает", "Поиск жилья", "Туры и экскурсии", "Рестораны", "Транспорт"] },
            { title: "Владельцам", links: ["Разместить объект", "Тарифы", "Панель управления", "Аналитика", "Поддержка"] },
            { title: "Компания", links: ["О нас", "Блог", "Карьера", "Пресс-центр", "Партнёрам"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>{col.title}</div>
              <ul className="space-y-2">{col.links.map((link) => <li key={link}><a href="#" className="text-sm transition-colors hover:underline" style={{ color: "var(--text-secondary)" }}>{link}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-2" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>© 2024 IssykRelax. Все права защищены.</span>
          <div className="flex gap-4">
            {["Политика конфиденциальности", "Условия использования", "Карта сайта"].map((link) => <a key={link} href="#" className="text-xs" style={{ color: "var(--text-secondary)" }}>{link}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
