import { useState, useEffect } from "react";
import { Globe, ChevronDown, User, Heart, Bell, LogOut, Settings, LayoutDashboard, Home, Search, Info, MessageSquare, LogIn, Plus, Menu } from "lucide-react";
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
      {/* Desktop Header */}
      <nav style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }} className="hidden md:block sticky top-0 z-50 shadow-sm">
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
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-around h-16 px-2">
          {navLinks.map((link) => {
            const icons: Record<string, React.ReactNode> = {
              landing: <Home size={20} />,
              search: <Search size={20} />,
              about: <Info size={20} />,
              feedback: <MessageSquare size={20} />,
            };
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors"
                style={{ color: isActive ? "var(--lake-blue)" : "var(--text-secondary)" }}
              >
                {icons[link.page]}
                <span className="text-[10px] font-medium">{link.label}</span>
              </button>
            );
          })}

          {/* Profile / Auth */}
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors"
              style={{ color: currentPage === "dashboard" || currentPage === "owner-dashboard" ? "var(--lake-blue)" : "var(--text-secondary)" }}
            >
              <User size={20} />
              <span className="text-[10px] font-medium">Профиль</span>
            </button>
          ) : (
            <button
              onClick={() => { setAuthMode("login"); setAuthOpen(true); }}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <LogIn size={20} />
              <span className="text-[10px] font-medium">Войти</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile FAB for owner add-listing */}
      {userRole === "owner" && (
        <button
          onClick={() => onNavigate("add-listing")}
          className="md:hidden fixed z-50 bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
          style={{ background: "var(--lake-blue)" }}
        >
          <Plus size={24} />
        </button>
      )}

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
