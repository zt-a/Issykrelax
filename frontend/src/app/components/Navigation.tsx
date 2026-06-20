import { useState, useEffect, useRef } from "react";
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
import { getCurrentPage } from "../lib/navigate";
import type { CategoryResponse } from "../types/api";
import type { NavParams } from "../App";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, params?: NavParams) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  useEffect(() => {
    getCategories().then(setCategories).catch(() => toast.error("Ошибка загрузки категорий"));
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;
      if (!el.contains(link)) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("//") || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) return;
      if (link.getAttribute("target") === "_blank") return;
      if (link.getAttribute("download") != null) return;

      e.preventDefault();

      const pathname = href.startsWith("/") ? href : `/${href}`;
      const page = getCurrentPage(pathname);

      let params: NavParams = {};
      if (page === "category" && pathname.startsWith("/category/")) {
        params = { category_slug: pathname.split("/")[2] };
      } else if (page === "city" && pathname.startsWith("/city/")) {
        params = { city_slug: pathname.split("/")[2] };
      } else if (page === "property" && pathname.startsWith("/property/")) {
        params = { property_id: pathname.split("/")[2] };
      } else if (page === "activity" && pathname.startsWith("/activity/")) {
        params = { activity_id: pathname.split("/")[2] };
      } else if (page === "transfer" && pathname.startsWith("/transfer/")) {
        params = { transfer_id: pathname.split("/")[2] };
      } else if (page === "tour" && pathname.startsWith("/tour/")) {
        params = { tour_id: pathname.split("/")[2] };
      } else if (page === "tour-package" && pathname.startsWith("/tour-package/")) {
        params = { pkg_id: pathname.split("/")[2] };
      } else if (page === "restaurant" && pathname.startsWith("/restaurant/")) {
        params = { restaurant_id: pathname.split("/")[2] };
      }

      onNavigateRef.current(page, params);
    };

    el.addEventListener("click", handler, false);
    return () => el.removeEventListener("click", handler, false);
  }, []);

  const navLinks = [
    { label: "Главная", href: "/" },
    { label: "Жильё", href: "/search" },
    { label: "Туры", href: "/tours" },
    { label: "Рестораны", href: "/restaurants" },
    { label: "Активный отдых", href: "/activities" },
    { label: "Трансферы", href: "/transfers" },
    { label: "Пакетные туры", href: "/tour-packages" },
  ];

  const moreLinks = [
    { label: "О нас", href: "/about", icon: Info },
    { label: "Обратная связь", href: "/feedback", icon: MessageSquare },
  ];

  const mobileExtraLinks = [
    { label: "Активный отдых", href: "/activities", icon: Mountain },
    { label: "Трансферы", href: "/transfers", icon: Car },
    { label: "Пакетные туры", href: "/tour-packages", icon: Backpack },
    { label: "О нас", href: "/about", icon: Info },
    { label: "Обратная связь", href: "/feedback", icon: MessageSquare },
  ];

  const mobileNavItems = [
    { label: "Главная", href: "/", icon: <Home size={20} /> },
    { label: "Жильё", href: "/search", icon: <Search size={20} /> },
    { label: "Туры", href: "/tours", icon: <Compass size={20} /> },
    { label: "Рестораны", href: "/restaurants", icon: <Utensils size={20} /> },
  ];

  const isActive = (href: string) => {
    if (href === "/") return currentPage === "landing";
    return currentPage === href.slice(1);
  };

  return (
    <div ref={navRef}>
      {/* Desktop Header */}
      <nav style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }} className="hidden md:block sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logotip} alt="IssykRelax" className="h-8 w-auto" />
              <span className="font-bold text-lg" style={{ color: "var(--lake-blue)", fontFamily: "var(--font-display)" }}>
                IssykRelax
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive(link.href) ? "var(--lake-blue)" : "var(--text-secondary)",
                    background: isActive(link.href) ? "var(--lake-blue-light)" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
                    Ещё <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {moreLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <a href={link.href} className="flex items-center">
                        <link.icon size={15} className="mr-2" /> {link.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                  {categories.length > 0 && <DropdownMenuSeparator />}
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                      <a href={`/category/${cat.slug}`}>{cat.name}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {hasRole("owner") && (
                <a
                  href="/add-listing"
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{ color: "var(--lake-blue)", background: "var(--lake-blue-light)" }}
                >
                  + Добавить объект
                </a>
              )}

              <button className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                <Globe size={16} />
                <span>RU</span>
                <ChevronDown size={14} />
              </button>

              {user ? (
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
                    <DropdownMenuItem asChild>
                      <a href="/dashboard" className="flex items-center"><User size={15} className="mr-2" /> Мой профиль</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/dashboard" className="flex items-center"><Heart size={15} className="mr-2" /> Избранное</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/dashboard" className="flex items-center"><Bell size={15} className="mr-2" /> Уведомления</a>
                    </DropdownMenuItem>
                    {hasRole("owner") && (
                      <DropdownMenuItem asChild>
                        <a href="/owner-dashboard" className="flex items-center"><LayoutDashboard size={15} className="mr-2" /> Панель владельца</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("driver") && (
                      <DropdownMenuItem asChild>
                        <a href="/driver-dashboard" className="flex items-center"><Car size={15} className="mr-2" /> Панель водителя</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("guide") && (
                      <DropdownMenuItem asChild>
                        <a href="/guide-dashboard" className="flex items-center"><Compass size={15} className="mr-2" /> Панель гида</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("activity_provider") && (
                      <DropdownMenuItem asChild>
                        <a href="/activity-dashboard" className="flex items-center"><Dumbbell size={15} className="mr-2" /> Панель аниматора</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("restaurant_partner") && (
                      <DropdownMenuItem asChild>
                        <a href="/restaurant-dashboard" className="flex items-center"><Utensils size={15} className="mr-2" /> Панель ресторана</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("agency") && (
                      <DropdownMenuItem asChild>
                        <a href="/agency-dashboard" className="flex items-center"><Building2 size={15} className="mr-2" /> Панель агентства</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("concierge") && (
                      <DropdownMenuItem asChild>
                        <a href="/concierge-dashboard" className="flex items-center"><Bell size={15} className="mr-2" /> Панель консьержа</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("translator") && (
                      <DropdownMenuItem asChild>
                        <a href="/translator-dashboard" className="flex items-center"><Languages size={15} className="mr-2" /> Панель переводчика</a>
                      </DropdownMenuItem>
                    )}
                    {(hasRole("admin") || hasRole("moderator")) && (
                      <DropdownMenuItem asChild>
                        <a href="/moderator" className="flex items-center"><Shield size={15} className="mr-2" /> Модерация</a>
                      </DropdownMenuItem>
                    )}
                    {hasRole("admin") && (
                      <DropdownMenuItem asChild>
                        <a href="/admin" className="flex items-center"><Settings size={15} className="mr-2" /> Администратор</a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); window.location.href = "/"; }}>
                      <LogOut size={15} className="mr-2" /> Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild><a href="/login">Войти</a></Button>
                  <Button size="sm" style={{ background: "var(--lake-blue)" }} asChild><a href="/register">Регистрация</a></Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors"
                style={{ color: active ? "var(--lake-blue)" : "var(--text-secondary)" }}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            );
          })}

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
                  <DropdownMenuItem key={link.href} asChild>
                    <a href={link.href} className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                      <Icon size={15} className="mr-2" /> {link.label}
                    </a>
                  </DropdownMenuItem>
                );
              })}
              {categories.length > 0 && <DropdownMenuSeparator />}
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} asChild>
                  <a href={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}>{cat.name}</a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <a href="/dashboard" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                      <User size={15} className="mr-2" /> Профиль
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); window.location.href = "/"; setMobileMenuOpen(false); }}>
                    <LogOut size={15} className="mr-2" /> Выйти
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <a href="/login" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn size={15} className="mr-2" /> Войти
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile FAB for owner add-listing */}
      {hasRole("owner") && (
        <a
          href="/add-listing"
          className="md:hidden fixed z-50 bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
          style={{ background: "var(--lake-blue)" }}
        >
          <Plus size={24} />
        </a>
      )}
    </div>
  );
}
