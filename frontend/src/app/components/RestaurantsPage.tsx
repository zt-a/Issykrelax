import { useState } from "react";
import { Star, MapPin, Clock, Phone, Heart, Search, Utensils, Fish, Beef, Leaf, Coffee, ChevronDown } from "lucide-react";
import { SEO } from "./SEO";
import { breadcrumbSchema } from "../lib/schemas";

interface RestaurantsPageProps {
  onNavigate: (page: string) => void;
}

const RESTAURANTS = [
  { id: 1, name: "Ресторан «Иссык-Куль»", cuisine: "Кыргызская", price: "$$", rating: 4.8, reviews: 312, hours: "10:00–23:00", location: "Чолпон-Ата, ул. Садовая 14", phone: "+996 312 456789", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop", tags: ["Вид на озеро", "Терраса", "Детское меню"], cuisineType: "kyrgyz" },
  { id: 2, name: "Taverna Mediterran", cuisine: "Средиземноморская", price: "$$$", rating: 4.7, reviews: 187, hours: "12:00–01:00", location: "Бостери, пр. Прибрежный 8", phone: "+996 312 567890", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop", tags: ["Свежая рыба", "Вино", "Романтично"], cuisineType: "sea" },
  { id: 3, name: "Кафе «Манас»", cuisine: "Кыргызская / Русская", price: "$", rating: 4.6, reviews: 445, hours: "08:00–22:00", location: "Чолпон-Ата, центр", phone: "+996 312 345678", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop", tags: ["Завтраки", "Семейное", "Доступные цены"], cuisineType: "kyrgyz" },
  { id: 4, name: "Steak House «Гриль»", cuisine: "Мясная", price: "$$$", rating: 4.9, reviews: 98, hours: "13:00–00:00", location: "Бостери", phone: "+996 312 678901", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", tags: ["Мясо на гриле", "Барбекю зона", "VIP-залы"], cuisineType: "meat" },
  { id: 5, name: "Вегетарианское кафе «Зелёная лагуна»", cuisine: "Вегетарианская", price: "$$", rating: 4.5, reviews: 62, hours: "09:00–21:00", location: "Тамчы", phone: "+996 312 789012", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop", tags: ["Веганское меню", "Эко-продукты", "Без глютена"], cuisineType: "veg" },
  { id: 6, name: "Чайхана «Восток»", cuisine: "Восточная", price: "$", rating: 4.4, reviews: 231, hours: "07:00–23:00", location: "Кара-Ой", phone: "+996 312 890123", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&h=400&fit=crop", tags: ["Плов", "Шашлык", "Кальян"], cuisineType: "eastern" },
];

const CUISINE_FILTERS = [
  { key: "all", label: "Все кухни", icon: Utensils },
  { key: "kyrgyz", label: "Кыргызская", icon: Utensils },
  { key: "sea", label: "Морская", icon: Fish },
  { key: "meat", label: "Мясная", icon: Beef },
  { key: "veg", label: "Веган", icon: Leaf },
  { key: "eastern", label: "Восточная", icon: Coffee },
];

export function RestaurantsPage({ onNavigate }: RestaurantsPageProps) {
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [saved, setSaved] = useState<number[]>([]);

  const filtered = RESTAURANTS.filter((r) => {
    if (cuisineFilter !== "all" && r.cuisineType !== cuisineFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.reviews - a.reviews);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <SEO
        title="Рестораны Иссык-Куля"
        description="Лучшие рестораны, кафе и столовые на Иссык-Куле. Кыргызская, средиземноморская, восточная кухня. Бронируйте столики онлайн."
        canonical="/restaurants"
        jsonLd={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Рестораны", url: "/restaurants" },
        ])}
      />
      {/* Header */}
      <div className="py-10 px-4" style={{ background: "linear-gradient(135deg, var(--lake-blue-dark) 0%, var(--lake-blue) 100%)" }}>
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Рестораны Иссык-Куля
          </h1>
          <p className="text-white/80 mb-6">Лучшие заведения на берегу — от традиционного плова до морской кухни</p>
          <div className="max-w-xl mx-auto flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-lg">
            <Search size={18} style={{ color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Название ресторана или кухня..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {CUISINE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setCuisineFilter(f.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border"
                style={{
                  background: cuisineFilter === f.key ? "var(--lake-blue)" : "white",
                  color: cuisineFilter === f.key ? "white" : "var(--text-secondary)",
                  borderColor: cuisineFilter === f.key ? "var(--lake-blue)" : "var(--border)",
                }}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border bg-white outline-none"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <option value="rating">Рейтинг</option>
              <option value="reviews">Популярность</option>
            </select>
          </div>
        </div>

        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Найдено <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{filtered.length}</span> ресторанов
        </p>

        {/* Restaurant cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="relative overflow-hidden" style={{ height: 220 }}>
                <img src={r.image} alt={r.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => setSaved((prev) => prev.includes(r.id) ? prev.filter((i) => i !== r.id) : [...prev, r.id])}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <Heart size={15} fill={saved.includes(r.id) ? "#ef4444" : "none"} stroke={saved.includes(r.id) ? "#ef4444" : "#6b8299"} />
                </button>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold" style={{ background: "white", color: "var(--text-primary)" }}>
                  {r.price}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{r.name}</h3>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Star size={12} fill="var(--sand)" stroke="var(--sand)" />
                    <span className="text-xs font-bold">{r.rating}</span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>({r.reviews})</span>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--turquoise)" }}>{r.cuisine}</p>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={11} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.location}</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Clock size={11} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.hours}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${r.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-colors hover:bg-gray-50"
                    style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                  >
                    <Phone size={13} /> Позвонить
                  </a>
                  <button
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "var(--lake-blue)" }}
                  >
                    Забронировать столик
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
