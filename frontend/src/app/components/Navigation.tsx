import { useState, useEffect } from "react";
import { Menu, X, Globe, ChevronDown, User, Heart, Bell, LogOut, Settings, LayoutDashboard } from "lucide-react";
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
import { AuthModal } from "./AuthModal";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn?: boolean;
  userRole?: "tourist" | "owner" | "admin";
}

export function Navigation({ currentPage, onNavigate, isLoggedIn = true, userRole = "tourist" }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => toast.error("Ошибка загрузки категорий"));
  }, []);

  const navLinks = [
    { label: "Главная", page: "landing" },
    { label: "Жильё", page: "search" },
    { label: "О нас", page: "about" },
    { label: "Обратная связь", page: "feedback" },
  ];

  return (
    <>
      <nav style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--lake-blue), var(--turquoise))" }}>
                <span className="text-white text-sm font-bold">IK</span>
              </div>
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
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: currentPage === link.page ? "var(--lake-blue)" : "var(--text-secondary)",
                    background: currentPage === link.page ? "var(--lake-blue-light)" : "transparent",
                  }}
                >
                  {link.label}
                </button>
              ))}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate("search", { category_id: cat.id })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "var(--surface)", color: "var(--text-secondary)" }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {userRole === "owner" && (
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
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop" />
                        <AvatarFallback style={{ background: "var(--lake-blue)", color: "#fff" }}>АИ</AvatarFallback>
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
                    {(userRole === "owner" || userRole === "admin") && (
                      <DropdownMenuItem onClick={() => onNavigate("owner-dashboard")}>
                        <LayoutDashboard size={15} className="mr-2" /> Панель владельца
                      </DropdownMenuItem>
                    )}
                    {userRole === "admin" && (
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
                  <Button variant="ghost" size="sm" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>Войти</Button>
                  <Button size="sm" style={{ background: "var(--lake-blue)" }} onClick={() => { setAuthMode("register"); setAuthOpen(true); }}>Регистрация</Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "var(--text-secondary)" }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-2" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 py-2">
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>КАТЕГОРИИ</div>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { onNavigate("search", { category_id: cat.id }); setMobileOpen(false); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: "var(--surface)", color: "var(--text-primary)" }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <hr style={{ borderColor: "var(--border)" }} />
            {userRole === "owner" && (
              <button onClick={() => { onNavigate("add-listing"); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--lake-blue)" }}>
                + Добавить объект
              </button>
            )}
            {isLoggedIn ? (
              <>
                <button onClick={() => { onNavigate("dashboard"); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Мой профиль
                </button>
                <button onClick={() => { logout(); onNavigate("landing"); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Выйти
                </button>
              </>
            ) : (
              <button onClick={() => { setAuthMode("login"); setAuthOpen(true); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Войти
              </button>
            )}
          </div>
        )}
      </nav>

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        onSuccess={() => setAuthOpen(false)}
      />
    </>
  );
}
