import { useState } from "react";
import { Star, Clock, Users, MapPin, Heart, Search, Mountain, Sailboat, Camera, ChevronRight, CheckCircle } from "lucide-react";

interface ToursPageProps {
  onNavigate: (page: string) => void;
}

const TOURS = [
  {
    id: 1,
    title: "Конный тур в Тянь-Шань",
    category: "adventure",
    duration: "3 дня / 2 ночи",
    groupSize: "до 8 чел",
    price: 15000,
    rating: 4.9,
    reviews: 47,
    difficulty: "Средний",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=460&fit=crop",
    location: "Чолпон-Ата → Горы",
    includes: ["Коня и снаряжение", "Проживание в юрте", "Питание 3-разовое", "Гид-профессионал"],
    description: "Верховая езда через живописные горные пастбища с ночёвкой в традиционных юртах. Виды на Тянь-Шань просто захватывают дух.",
  },
  {
    id: 2,
    title: "Парусная прогулка по озеру",
    category: "water",
    duration: "4 часа",
    groupSize: "до 12 чел",
    price: 3500,
    rating: 4.8,
    reviews: 124,
    difficulty: "Лёгкий",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=700&h=460&fit=crop",
    location: "Чолпон-Ата",
    includes: ["Яхту и снаряжение", "Капитана", "Снэки и напитки", "Фотосессия"],
    description: "Незабываемая прогулка на яхте по кристально чистым водам Иссык-Куля. Лучший способ увидеть берег с воды.",
  },
  {
    id: 3,
    title: "Экскурсия в Григорьевское ущелье",
    category: "nature",
    duration: "1 день",
    groupSize: "до 20 чел",
    price: 2500,
    rating: 4.7,
    reviews: 89,
    difficulty: "Лёгкий",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&h=460&fit=crop",
    location: "Бостери",
    includes: ["Транспорт туда-обратно", "Гида", "Страховку", "Обед"],
    description: "Один из красивейших ущелий Кыргызстана. Горные реки, водопады, альпийские луга и потрясающая природа.",
  },
  {
    id: 4,
    title: "Дайвинг в Иссык-Куле",
    category: "water",
    duration: "3 часа",
    groupSize: "до 6 чел",
    price: 4500,
    rating: 4.6,
    reviews: 33,
    difficulty: "Для начинающих",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&h=460&fit=crop",
    location: "Чолпон-Ата",
    includes: ["Оборудование для дайвинга", "Инструктора", "Сертификат", "Видеосъёмку"],
    description: "Погрузитесь в прозрачные воды высокогорного озера. Уникальный подводный мир — затопленные деревни и артефакты.",
  },
  {
    id: 5,
    title: "Фототур «Закат над Иссык-Кулём»",
    category: "photo",
    duration: "5 часов",
    groupSize: "до 10 чел",
    price: 3000,
    rating: 4.95,
    reviews: 28,
    difficulty: "Лёгкий",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=460&fit=crop",
    location: "Иссык-Куль",
    includes: ["Фотографа-гида", "Транспорт", "Советы по съёмке", "Обработку 10 фото"],
    description: "Снимите незабываемые закаты над озером с лучших точек. Идеально для путешественников и фотолюбителей.",
  },
  {
    id: 6,
    title: "Треккинг к Семёновскому ущелью",
    category: "adventure",
    duration: "2 дня / 1 ночь",
    groupSize: "до 15 чел",
    price: 8000,
    rating: 4.85,
    reviews: 56,
    difficulty: "Сложный",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&h=460&fit=crop",
    location: "Чолпон-Ата → Горы",
    includes: ["Снаряжение для трекинга", "Питание", "Ночёвку в палатках", "Гида"],
    description: "Серьёзный горный поход для любителей приключений. Перевалы, ледники, горные озёра и потрясающие панорамы.",
  },
];

const CATEGORIES = [
  { key: "all", label: "Все", icon: CheckCircle },
  { key: "adventure", label: "Приключения", icon: Mountain },
  { key: "water", label: "Водные", icon: Sailboat },
  { key: "nature", label: "Природа", icon: Mountain },
  { key: "photo", label: "Фототуры", icon: Camera },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  "Лёгкий": "#22c55e",
  "Средний": "#f59e0b",
  "Сложный": "#ef4444",
  "Для начинающих": "#3b82f6",
};

export function ToursPage({ onNavigate }: ToursPageProps) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedTour, setSelectedTour] = useState<typeof TOURS[0] | null>(null);

  const filtered = TOURS.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selectedTour) {
    return (
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => setSelectedTour(null)} className="flex items-center gap-1 text-sm mb-5 hover:underline" style={{ color: "var(--lake-blue)" }}>
            ← Назад к турам
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden mb-6" style={{ height: 380 }}>
                <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{selectedTour.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}><Clock size={13} />{selectedTour.duration}</span>
                <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}><Users size={13} />{selectedTour.groupSize}</span>
                <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}><MapPin size={13} />{selectedTour.location}</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${DIFFICULTY_COLORS[selectedTour.difficulty]}20`, color: DIFFICULTY_COLORS[selectedTour.difficulty] }}>
                  {selectedTour.difficulty}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{selectedTour.description}</p>
              <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>В стоимость включено:</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedTour.includes.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle size={14} style={{ color: "var(--turquoise)" }} /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="sticky top-24 rounded-2xl border p-6 shadow-lg" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={14} fill="var(--sand)" stroke="var(--sand)" />
                  <span className="font-bold">{selectedTour.rating}</span>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>· {selectedTour.reviews} отзывов</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>от {selectedTour.price.toLocaleString()} Сом</div>
                <div className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>с человека</div>
                <div className="mb-4">
                  <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-secondary)" }}>ДАТА ТУРА</label>
                  <input type="date" className="w-full border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div className="mb-5">
                  <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-secondary)" }}>УЧАСТНИКОВ</label>
                  <input type="number" min="1" defaultValue="2" className="w-full border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="w-full py-3 rounded-xl font-semibold text-white mb-3 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--lake-blue), var(--turquoise))" }}
                >
                  Забронировать тур
                </button>
                <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>Бесплатная отмена за 48 часов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="py-10 px-4" style={{ background: "linear-gradient(135deg, #0c4a6e 0%, var(--turquoise) 100%)" }}>
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Туры и экскурсии
          </h1>
          <p className="text-white/80 mb-6">Незабываемые приключения на берегах высокогорного озера</p>
          <div className="max-w-xl mx-auto flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-lg">
            <Search size={18} style={{ color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Название тура..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border"
              style={{
                background: category === c.key ? "var(--lake-blue)" : "white",
                color: category === c.key ? "white" : "var(--text-secondary)",
                borderColor: category === c.key ? "var(--lake-blue)" : "var(--border)",
              }}
            >
              <c.icon size={14} />
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <div
              key={tour.id}
              className="rounded-2xl border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden cursor-pointer"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
              onClick={() => setSelectedTour(tour)}
            >
              <div className="relative overflow-hidden" style={{ height: 240 }}>
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={(e) => { e.stopPropagation(); setSaved((prev) => prev.includes(tour.id) ? prev.filter((i) => i !== tour.id) : [...prev, tour.id]); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <Heart size={15} fill={saved.includes(tour.id) ? "#ef4444" : "none"} stroke={saved.includes(tour.id) ? "#ef4444" : "#6b8299"} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <Clock size={10} className="inline mr-1" />{tour.duration}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <Users size={10} className="inline mr-1" />{tour.groupSize}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-bold text-sm flex-1" style={{ color: "var(--text-primary)" }}>{tour.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: `${DIFFICULTY_COLORS[tour.difficulty]}20`, color: DIFFICULTY_COLORS[tour.difficulty] }}>
                    {tour.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <MapPin size={11} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{tour.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Star size={11} fill="var(--sand)" stroke="var(--sand)" />
                      <span className="text-xs font-bold">{tour.rating}</span>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>({tour.reviews})</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: "var(--lake-blue)" }}>от {tour.price.toLocaleString()} Сом</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-lg transition-colors" style={{ background: "var(--lake-blue-light)", color: "var(--lake-blue)" }}>
                    Подробнее <ChevronRight size={12} />
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
