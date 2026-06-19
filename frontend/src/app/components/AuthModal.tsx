import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface AuthModalProps {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, mode, onClose, onSwitchMode, onSuccess }: AuthModalProps) {
  const { login, registerUser, registerOwner } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Введите корректный email";
    if (password.length < 6) errs.password = "Минимум 6 символов";
    if (mode === "register") {
      if (!fullName.trim()) errs.fullName = "Введите имя";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Добро пожаловать!");
      } else if (isOwner) {
        await registerOwner({ email, password, full_name: fullName, phone, business_phone: businessPhone });
        toast.success("Регистрация владельца прошла успешно");
      } else {
        await registerUser({ email, password, full_name: fullName, phone });
        toast.success("Регистрация прошла успешно");
      }
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative custom-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {mode === "login" ? "Вход" : "Регистрация"}
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {mode === "login" ? "Добро пожаловать!" : "Создайте аккаунт"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Имя</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors((prev) => ({ ...prev, fullName: "" })); }}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: fieldErrors.fullName ? "#ef4444" : "var(--border)" }}
                  placeholder="Ваше имя"
                />
                {fieldErrors.fullName && <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: "var(--border)" }}
                  placeholder="+996 XXX XXX XXX"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: "" })); }}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: fieldErrors.email ? "#ef4444" : "var(--border)" }}
              placeholder="email@example.com"
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: "" })); }}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: fieldErrors.password ? "#ef4444" : "var(--border)" }}
              placeholder="Минимум 6 символов"
            />
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          {mode === "register" && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOwner"
                  checked={isOwner}
                  onChange={(e) => setIsOwner(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isOwner" className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Я владелец жилья
                </label>
              </div>
              {isOwner && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Телефон для бизнеса
                  </label>
                  <input
                    type="tel"
                    required
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                    style={{ borderColor: "var(--border)" }}
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
            style={{ background: submitting ? "var(--text-secondary)" : "var(--lake-blue)" }}
          >
            {submitting ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: "var(--text-secondary)" }}>
          {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button onClick={onSwitchMode} className="font-medium" style={{ color: "var(--lake-blue)" }}>
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>

        {mode === "login" && (
          <button
            onClick={() => setShowForgot(true)}
            className="block text-xs mt-3 mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Забыли пароль?
          </button>
        )}

        <ForgotPasswordModal
          open={showForgot}
          onClose={() => setShowForgot(false)}
          onBack={() => setShowForgot(false)}
        />

        {mode === "login" && (
          <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "var(--lake-blue-light)", color: "var(--text-secondary)" }}>
            <p className="font-medium mb-1">Тестовые аккаунты:</p>
            {/* <p>admin@issykrelax.kg / admin123</p> */}
            <p>owner@issykrelax.kg / owner123</p>
            <p>user@issykrelax.kg / user123</p>
          </div>
        )}
      </div>
    </div>
  );
}
