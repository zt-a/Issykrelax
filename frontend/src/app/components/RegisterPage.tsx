import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SEO } from "./SEO";
import { Button } from "./ui/button";
import logotip from "@/assets/logo.png";

interface RegisterPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { registerUser, registerOwner } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Введите имя";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Введите корректный email";
    if (password.length < 6) errs.password = "Минимум 6 символов";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setSubmitting(true);
    try {
      if (isOwner) {
        await registerOwner({ email, password, full_name: fullName, phone, business_phone: businessPhone });
      } else {
        await registerUser({ email, password, full_name: fullName, phone });
      }
      onNavigate("landing");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка регистрации";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "var(--surface)" }}>
      <SEO title="Регистрация" description="Создайте аккаунт на IssykRelax — крупнейшем маркетплейсе отдыха на Иссык-Куле, Кыргызстан. Бронируйте жильё, добавляйте объекты, управляйте бизнесом." canonical="/register" />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate("landing")} className="inline-flex items-center gap-2 mb-4">
            <img src={logotip} alt="IssykRelax" className="h-8 w-auto" />
            <span className="font-bold text-lg" style={{ color: "var(--lake-blue)" }}>IssykRelax</span>
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Регистрация</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Создайте аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Имя</label>
            <input type="text" required value={fullName} onChange={(e) => { setFullName(e.target.value); setFieldErrors((prev) => ({ ...prev, fullName: "" })); }} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: fieldErrors.fullName ? "#ef4444" : "var(--border)" }} placeholder="Ваше имя" />
            {fieldErrors.fullName && <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Телефон</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "var(--border)" }} placeholder="+996 XXX XXX XXX" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Email</label>
            <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: "" })); }} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: fieldErrors.email ? "#ef4444" : "var(--border)" }} placeholder="email@example.com" />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Пароль</label>
            <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: "" })); }} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: fieldErrors.password ? "#ef4444" : "var(--border)" }} placeholder="Минимум 6 символов" />
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isOwner" checked={isOwner} onChange={(e) => setIsOwner(e.target.checked)} className="rounded" />
            <label htmlFor="isOwner" className="text-sm" style={{ color: "var(--text-primary)" }}>Я владелец жилья</label>
          </div>
          {isOwner && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Телефон для бизнеса</label>
              <input type="tel" required value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "var(--border)" }} placeholder="+996 XXX XXX XXX" />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full py-3" style={{ background: submitting ? "var(--text-secondary)" : "var(--lake-blue)" }}>
            {submitting ? "Загрузка..." : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "var(--text-secondary)" }}>
          Уже есть аккаунт?{" "}
          <button onClick={() => onNavigate("login")} className="font-medium" style={{ color: "var(--lake-blue)" }}>
            Войти
          </button>
        </p>
      </div>
    </div>
  );
}
