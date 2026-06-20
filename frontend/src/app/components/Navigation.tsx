import { useState, useEffect } from "react";
import { Globe, ChevronDown, User, Heart, Bell, LogOut, Settings, LayoutDashboard, Home, Search, Info, MessageSquare, LogIn, Plus, Menu, Shield, Car, Compass, Dumbbell, Utensils, Wallet, Mountain, Backpack, Ellipsis, Building2, Languages } from "lucide-react";
import logotip from "@/assets/logo.png";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/properties";
import type { CategoryResponse } from "../types/api";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  isLoggedIn?: boolean;
}

export function Navigation({ currentPage, onNavigate, isLoggedIn = true }: NavigationProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => toast.error("Ошибка загрузки категорий"));
  }, []);

  const navLinks = [
    { label: "Главная", page: "landing" },
    { label: "Жильё", page: "search" },
    { label: "Туры", page: "tours" },
    { label: "Рестораны", page: "restaurants" },
    { label: "Активный отдых", page: "activities" },
    { label: "Трансферы", page: "transfers" },
    { label: "Пакетные туры", page: "tour-packages" },
  ];

  const moreLinks = [
    { label: "О нас", page: "about", icon: Info },
    { label: "Обратная связь", page: "feedback", icon: MessageSquare },
  ];

  const mobileExtraLinks = [
    { label: "Активный отдых", page: "activities", icon: Mountain },
    { label: "Трансферы", page: "transfers", icon: Car },
    { label: "Пакетные туры", page: "tour-packages", icon: Backpack },
    { label: "О нас", page: "about", icon: Info },
    { label: "Обратная связь", page: "feedback", icon: MessageSquare },
  ];

  const mobileNavIcons: Record<string, React.ReactNode> = {
    landing: <Home size={20} />,
    search: <Search size={20} />,
    tours: <Compass size={20} />,
    restaurants: <Utensils size={20} />,
    activities: <Mountain size={20} />,
    transfers: <Car size={20} />,
    "tour-packages": <Backpack size={20} />,
    about: <Info size={20} />,
    feedback: <MessageSquare size={20} />,
  };

  return (
    <>
      {/* Desktop Header */}
      <nav style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }} className="hidden md:block sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <img src={logotip} alt="IssykRelax" className="h-8 w-auto" />
              <span className="font-bold text-lg" style={{ color: "var(--lake-blue)", fontFamily: "var(--font-display)" }}>
                IssykRelax
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: currentPage === link.page ? "var(--lake-blue)" : "var(--text-secondary)",
                    background: currentPage === link.page ? "var(--lake-blue-light)" : "transparent",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
                    Ещё <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {moreLinks.map((link) => (
                    <DropdownMenuItem key={link.page} onClick={() => onNavigate(link.page)}>
                      <link.icon size={15} className="mr-2" /> {link.label}
                    </DropdownMenuItem>
                  ))}
                  {categories.length > 0 && <DropdownMenuSeparator />}
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => onNavigate("category", { category_slug: cat.slug })}>
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {hasRole("owner") && (
                <button
                  onClick={() => onNavigate("add-listing")}
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{ color: "var(--lake-blue)", background: "var(--lake-blue-light)" }}
                >
                  + Добавить объект
                </button>
              )}

              <button className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                <Globe size={16} />
                <span>RU</span>
                <ChevronDown size={14} />
              </button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 rounded-xl border transition-shadow hover:shadow-md" style={{ borderColor: "var(--border)" }}>
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={user?.avatar_url || undefined} />
                        <AvatarFallback style={{ background: "var(--lake-blue)", color: "#fff" }}>{(user?.full_name?.[0] || "U").toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Menu size={16} style={{ color: "var(--text-secondary)" }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <User size={15} className="mr-2" /> Мой профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <Heart size={15} className="mr-2" /> Избранное
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <Bell size={15} className="mr-2" /> Уведомления
                    </DropdownMenuItem>
                    {hasRole("owner") && (
                      <DropdownMenuItem onClick={() => onNavigate("owner-dashboard")}>
                        <LayoutDashboard size={15} className="mr-2" /> Панель владельца
                      </DropdownMenuItem>
                    )}
                    {hasRole("driver") && (
                      <DropdownMenuItem onClick={() => onNavigate("driver-dashboard")}>
                        <Car size={15} className="mr-2" /> Панель водителя
                      </DropdownMenuItem>
                    )}
                    {hasRole("guide") && (
                      <DropdownMenuItem onClick={() => onNavigate("guide-dashboard")}>
                        <Compass size={15} className="mr-2" /> Панель гида
                      </DropdownMenuItem>
                    )}
                    {hasRole("activity_provider") && (
                      <DropdownMenuItem onClick={() => onNavigate("activity-dashboard")}>
                        <Dumbbell size={15} className="mr-2" /> Панель аниматора
                      </DropdownMenuItem>
                    )}
                    {hasRole("restaurant_partner") && (
                      <DropdownMenuItem onClick={() => onNavigate("restaurant-dashboard")}>
                        <Utensils size={15} className="mr-2" /> Панель ресторана
                      </DropdownMenuItem>
                    )}
                    {hasRole("agency") && (
                      <DropdownMenuItem onClick={() => onNavigate("agency-dashboard")}>
                        <Building2 size={15} className="mr-2" /> Панель агентства
                      </DropdownMenuItem>
                    )}
                    {hasRole("concierge") && (
                      <DropdownMenuItem onClick={() => onNavigate("concierge-dashboard")}>
                        <Bell size={15} className="mr-2" /> Панель консьержа
                      </DropdownMenuItem>
                    )}
                    {hasRole("translator") && (
                      <DropdownMenuItem onClick={() => onNavigate("translator-dashboard")}>
                        <Languages size={15} className="mr-2" /> Панель переводчика
                      </DropdownMenuItem>
                    )}
                    {(hasRole("admin") || hasRole("moderator")) && (
                      <DropdownMenuItem onClick={() => onNavigate("moderator")}>
                        <Shield size={15} className="mr-2" /> Модерация
                      </DropdownMenuItem>
                    )}
                    {hasRole("admin") && (
                      <DropdownMenuItem onClick={() => onNavigate("admin")}>
                        <Settings size={15} className="mr-2" /> Администратор
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); onNavigate("landing"); }}>
                      <LogOut size={15} className="mr-2" /> Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate("login")}>Войти</Button>
                  <Button size="sm" style={{ background: "var(--lake-blue)" }} onClick={() => onNavigate("register")}>Регистрация</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-around h-16 px-2">
          {/* Always visible: Главная, Жильё, Туры, Рестораны */}
          {[
            { label: "Главная", page: "landing" },
            { label: "Жильё", page: "search" },
            { label: "Туры", page: "tours" },
            { label: "Рестораны", page: "restaurants" },
          ].map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors"
                style={{ color: isActive ? "var(--lake-blue)" : "var(--text-secondary)" }}
              >
                {mobileNavIcons[link.page]}
                <span className="text-[10px] font-medium">{link.label}</span>
              </button>
            );
          })}

          {/* Ещё button */}
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors" style={{ color: "var(--text-secondary)" }}>
                <Ellipsis size={20} />
                <span className="text-[10px] font-medium">Ещё</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mb-4">
              {mobileExtraLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <DropdownMenuItem key={link.page} onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}>
                    <Icon size={15} className="mr-2" /> {link.label}
                  </DropdownMenuItem>
                );
              })}
              {categories.length > 0 && <DropdownMenuSeparator />}
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} onClick={() => { onNavigate("category", { category_slug: cat.slug }); setMobileMenuOpen(false); }}>
                  {cat.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem onClick={() => { onNavigate("dashboard"); setMobileMenuOpen(false); }}>
                    <User size={15} className="mr-2" /> Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); onNavigate("landing"); setMobileMenuOpen(false); }}>
                    <LogOut size={15} className="mr-2" /> Выйти
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => { onNavigate("login"); setMobileMenuOpen(false); }}>
                  <LogIn size={15} className="mr-2" /> Войти
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile FAB for owner add-listing */}
      {hasRole("owner") && (
        <button
          onClick={() => onNavigate("add-listing")}
          className="md:hidden fixed z-50 bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
          style={{ background: "var(--lake-blue)" }}
        >
          <Plus size={24} />
        </button>
      )}
    </>
  );
}
