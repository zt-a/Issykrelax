import { useState, useEffect, useRef } from "react";
import {
  Search, MapPin, Star, ArrowRight, CheckCircle, ChevronLeft, ChevronRight,
  Waves, Tent, Hotel, Coffee, BedDouble, Home,
  Utensils, Compass, Dumbbell, Car, Backpack,
  Clock, Users, Shield, Zap, Building2,
} from "lucide-react";
// import logotip from "../../assets/logo.png";
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
  "Отель": { icon: Hotel, color: "#0CB8B6" },
  "Коттедж": { icon: BedDouble, color: "#7c3aed" },
  "Курорт": { icon: Waves, color: "#0B2545" },
  "Юрта": { icon: Tent, color: "#E8B86D" },
  "Гостевой дом": { icon: Coffee, color: "#dc2626" },
};
const DEFAULT_ICON = { icon: Home, color: "#64748b" };

const SERVICE_LINKS = [
  { page: "restaurants", icon: Utensils, label: "Рестораны", desc: "Национальная и европейская кухня", color: "#dc2626", bg: "#fef2f2" },
  { page: "tours", icon: Compass, label: "Туры", desc: "Экскурсии по Иссык-Кулю и горам", color: "#0B2545", bg: "#e8f4fd" },
  { page: "activities", icon: Dumbbell, label: "Активности", desc: "Водные виды спорта, треккинг", color: "#7c3aed", bg: "#f5f3ff" },
  { page: "transfers", icon: Car, label: "Трансферы", desc: "Встреча из аэропорта и поездки", color: "#ea580c", bg: "#fff7ed" },
  { page: "tour-packages", icon: Backpack, label: "Пакетные туры", desc: "Жильё, питание, экскурсии", color: "#16a34a", bg: "#f0fdf4" },
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

/* ─── inline styles ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap');

  .ir-landing * { box-sizing: border-box; }

  .ir-landing {
    font-family: 'Inter', sans-serif;
    background: #F8FAFB;
    color: #1a2a3a;
  }

  /* ── hero ── */
  .ir-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #0B2545;
  }
  .ir-hero-bg {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&h=1100&fit=crop') center/cover no-repeat;
    opacity: 0.35;
  }
  .ir-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(11,37,69,0.85) 0%, rgba(11,37,69,0.4) 50%, rgba(12,184,182,0.25) 100%);
  }
  .ir-hero-content {
    position: relative; z-index: 2;
    text-align: center;
    padding: 0 1rem;
    max-width: 900px;
    width: 100%;
  }
  .ir-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,184,109,0.15);
    border: 1px solid rgba(232,184,109,0.4);
    color: #E8B86D;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 6px 16px; border-radius: 100px;
    margin-bottom: 28px;
  }
  .ir-hero-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 900; line-height: 1.05;
    color: #fff; margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .ir-hero-title em {
    font-style: italic; color: #0CB8B6;
  }
  .ir-hero-sub {
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: rgba(255,255,255,0.7);
    margin: 0 0 48px; font-weight: 300; line-height: 1.6;
  }

  /* search bar */
  .ir-search-box {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 10px 10px 10px 20px;
    display: flex; align-items: center; gap: 12px;
    max-width: 700px; margin: 0 auto 24px;
    box-shadow: 0 24px 60px rgba(11,37,69,0.35);
  }
  .ir-search-input {
    flex: 1; border: none; outline: none;
    font-size: 0.95rem; background: transparent;
    color: #1a2a3a; font-family: 'Inter', sans-serif;
  }
  .ir-search-input::placeholder { color: #94a3b8; }
  .ir-search-btn {
    background: linear-gradient(135deg, #0B2545 0%, #0CB8B6 100%);
    color: white; border: none; cursor: pointer;
    padding: 14px 28px; border-radius: 12px;
    font-size: 0.9rem; font-weight: 600;
    font-family: 'Inter', sans-serif;
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }
  .ir-search-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(12,184,182,0.4); }

  .ir-tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .ir-tag {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.9); padding: 6px 16px; border-radius: 100px;
    font-size: 0.8rem; font-weight: 500; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .ir-tag:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.5); }

  /* wave divider */
  .ir-wave { display: block; width: 100%; line-height: 0; }

  /* ── sections ── */
  .ir-section { padding: 80px 1rem; }
  .ir-section-alt { background: #fff; }
  .ir-container { max-width: 1200px; margin: 0 auto; }

  .ir-section-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: #0CB8B6; margin-bottom: 10px;
  }
  .ir-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 700; color: #0B2545; margin: 0 0 12px; line-height: 1.2;
  }
  .ir-section-desc { color: #64748b; font-size: 1rem; margin: 0; font-weight: 400; }

  .ir-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; gap: 16px; flex-wrap: wrap; }
  .ir-link-btn {
    display: flex; align-items: center; gap: 6px;
    color: #0CB8B6; font-size: 0.875rem; font-weight: 600;
    background: none; border: none; cursor: pointer; padding: 0;
    font-family: 'Inter', sans-serif; white-space: nowrap;
    transition: gap 0.15s;
  }
  .ir-link-btn:hover { gap: 10px; }

  /* stats bar */
  .ir-stats-bar {
    position: relative; z-index: 2;
    max-width: 900px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4, 1fr);
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px; overflow: hidden;
    margin-top: 56px;
    backdrop-filter: blur(10px);
  }
  .ir-stat-item {
    padding: 20px 8px; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .ir-stat-item:last-child { border-right: none; }
  .ir-stat-value { font-size: 1.8rem; font-weight: 800; color: #fff; font-family: 'Playfair Display', serif; }
  .ir-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.6); margin-top: 2px; letter-spacing: 0.05em; }

  /* categories */
  .ir-cats { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px 32px; }
  .ir-cat-btn {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    background: none; border: none; cursor: pointer; padding: 4px 8px;
    transition: transform 0.15s;
  }
  .ir-cat-btn:hover { transform: translateY(-4px); }
  .ir-cat-icon {
    width: 72px; height: 72px; border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    transition: box-shadow 0.15s;
  }
  .ir-cat-btn:hover .ir-cat-icon { box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
  .ir-cat-name { font-size: 0.8rem; font-weight: 500; color: #1a2a3a; }

  /* services grid */
  .ir-services { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
  @media (max-width: 900px) { .ir-services { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .ir-services { grid-template-columns: 1fr; } }

  .ir-service-card {
    background: #fff; border: 1px solid #e8f0f8;
    border-radius: 20px; padding: 24px 16px;
    text-align: center; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .ir-service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(11,37,69,0.1); }
  .ir-service-icon {
    width: 60px; height: 60px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
    transition: transform 0.2s;
  }
  .ir-service-card:hover .ir-service-icon { transform: scale(1.1); }
  .ir-service-name { font-weight: 600; font-size: 0.9rem; color: #0B2545; margin-bottom: 6px; }
  .ir-service-desc { font-size: 0.75rem; color: #64748b; line-height: 1.5; }

  /* cards grid */
  .ir-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .ir-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  @media (max-width: 900px) {
    .ir-grid-3, .ir-grid-4 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 540px) {
    .ir-grid-3, .ir-grid-4 { grid-template-columns: 1fr; }
  }

  /* card */
  .ir-card {
    background: #fff; border: 1px solid #e8f0f8;
    border-radius: 20px; overflow: hidden; cursor: pointer; text-align: left;
    transition: transform 0.22s, box-shadow 0.22s;
    font-family: 'Inter', sans-serif;
    display: flex; flex-direction: column;
  }
  .ir-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(11,37,69,0.12); }
  .ir-card-img { position: relative; overflow: hidden; }
  .ir-card-img img, .ir-card-img > div > img { transition: transform 0.5s; }
  .ir-card:hover .ir-card-img img { transform: scale(1.06); }
  .ir-card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; }
  .ir-card-title { font-weight: 600; font-size: 0.9rem; color: #0B2545; margin: 0 0 8px; line-height: 1.4; }
  .ir-card-meta { display: flex; align-items: center; gap: 12px; font-size: 0.75rem; color: #64748b; flex-wrap: wrap; }
  .ir-card-meta-item { display: flex; align-items: center; gap: 4px; }
  .ir-price-overlay {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 14px;
    background: linear-gradient(to top, rgba(11,37,69,0.8), transparent);
    font-size: 1.1rem; font-weight: 700; color: #fff;
  }
  .ir-badge-overlay {
    position: absolute; top: 12px; right: 12px;
    background: rgba(255,255,255,0.92); color: #0B2545;
    font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 100px;
  }
  .ir-badge-green {
    position: absolute; top: 12px; left: 12px;
    background: rgba(22,163,74,0.9); color: #fff;
    font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 100px;
  }
  .ir-badge-blue {
    position: absolute; top: 12px; left: 12px;
    background: #0B2545; color: #fff;
    font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 100px;
  }
  .ir-cuisine-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: #fef2f2; color: #dc2626;
    font-size: 0.72rem; padding: 3px 8px; border-radius: 100px;
  }
  .ir-price-main { font-weight: 700; font-size: 1.05rem; color: #0CB8B6; }
  .ir-price-unit { font-size: 0.78rem; color: #64748b; }

  /* destinations */
  .ir-dest-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
  @media (max-width: 900px) { .ir-dest-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 540px) { .ir-dest-grid { grid-template-columns: repeat(2, 1fr); } }

  .ir-dest-card {
    position: relative; border-radius: 20px; overflow: hidden; cursor: pointer;
    aspect-ratio: 3/4;
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .ir-dest-card:hover { transform: scale(1.03); box-shadow: 0 16px 40px rgba(11,37,69,0.2); }
  .ir-dest-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .ir-dest-card:hover img { transform: scale(1.08); }
  .ir-dest-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(11,37,69,0.85) 0%, transparent 55%);
  }
  .ir-dest-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; }
  .ir-dest-name { font-size: 0.95rem; font-weight: 700; color: #fff; }
  .ir-dest-sub { font-size: 0.7rem; color: rgba(255,255,255,0.6); margin-top: 2px; }

  /* transfer cards */
  .ir-transfer-thumb {
    height: 140px; display: flex; align-items: center; justify-content: center;
    font-size: 4rem;
    position: relative;
  }

  /* testimonials */
  .ir-testimonial {
    background: #fff; border: 1px solid #e8f0f8; border-radius: 24px; padding: 32px;
  }
  .ir-stars { display: flex; gap: 3px; margin-bottom: 16px; }
  .ir-quote { font-size: 0.9rem; color: #64748b; line-height: 1.7; margin: 0 0 20px; font-style: italic; }
  .ir-reviewer { display: flex; align-items: center; gap: 12px; }
  .ir-reviewer-name { font-weight: 600; font-size: 0.875rem; color: #0B2545; }
  .ir-reviewer-city { font-size: 0.75rem; color: #94a3b8; margin-top: 1px; }

  /* why us */
  .ir-why-card {
    padding: 32px; border-radius: 24px;
    background: #fff; border: 1px solid #e8f0f8;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ir-why-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(11,37,69,0.08); }
  .ir-why-icon {
    width: 56px; height: 56px; border-radius: 18px;
    background: linear-gradient(135deg, #e8f4fd 0%, #d0f5f4 100%);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .ir-why-title { font-weight: 700; font-size: 1rem; color: #0B2545; margin: 0 0 10px; }
  .ir-why-desc { font-size: 0.85rem; color: #64748b; line-height: 1.65; margin: 0; }

  /* how it works */
  .ir-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  @media (max-width: 800px) { .ir-steps { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 440px) { .ir-steps { grid-template-columns: 1fr; } }
  .ir-step {
    position: relative; padding: 32px 24px; border-radius: 24px;
    background: #fff; border: 1px solid #e8f0f8; text-align: center;
  }
  .ir-step-num {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #0B2545, #0CB8B6);
    color: #fff; font-size: 1rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-family: 'Playfair Display', serif;
  }
  .ir-step-title { font-weight: 700; font-size: 1rem; color: #0B2545; margin: 0 0 8px; }
  .ir-step-desc { font-size: 0.82rem; color: #64748b; line-height: 1.65; margin: 0; }

  /* about block */
  .ir-about-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  @media (max-width: 800px) { .ir-about-grid { grid-template-columns: 1fr; gap: 32px; } }
  .ir-about-img {
    border-radius: 28px; overflow: hidden; position: relative;
    aspect-ratio: 4/3;
  }
  .ir-about-img img { width: 100%; height: 100%; object-fit: cover; }
  .ir-about-img-badge {
    position: absolute; bottom: 20px; left: 20px;
    background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
    border-radius: 14px; padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .ir-about-img-badge-icon { font-size: 1.5rem; }
  .ir-about-img-badge-text { font-size: 0.75rem; color: #0B2545; font-weight: 600; }
  .ir-about-img-badge-sub { font-size: 0.68rem; color: #64748b; margin-top: 1px; }
  .ir-about-text p { font-size: 0.92rem; color: #64748b; line-height: 1.8; margin: 0 0 16px; }
  .ir-about-text p:last-child { margin: 0; }

  /* CTA */
  .ir-cta-section {
    margin: 0 1rem 80px;
    border-radius: 32px;
    background: linear-gradient(135deg, #0B2545 0%, #0d3a6e 50%, #0CB8B6 100%);
    padding: 72px 2rem; text-align: center; position: relative; overflow: hidden;
  }
  .ir-cta-section::before {
    content: ''; position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop') center/cover;
    opacity: 0.08;
  }
  .ir-cta-content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
  .ir-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 900;
    color: #fff; margin: 0 0 16px; line-height: 1.1;
  }
  .ir-cta-desc { color: rgba(255,255,255,0.75); font-size: 1rem; margin: 0 0 32px; line-height: 1.7; }
  .ir-cta-features {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px;
    margin-bottom: 36px;
  }
  .ir-cta-feat { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.85); font-size: 0.82rem; }
  .ir-cta-feat svg { color: #E8B86D; flex-shrink: 0; }
  .ir-cta-btns { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  .ir-cta-btn-primary {
    background: #fff; color: #0B2545; border: none; cursor: pointer;
    padding: 15px 32px; border-radius: 14px; font-weight: 700; font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .ir-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
  .ir-cta-btn-secondary {
    background: transparent; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.4); cursor: pointer;
    padding: 15px 28px; border-radius: 14px; font-weight: 600; font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .ir-cta-btn-secondary:hover { background: rgba(255,255,255,0.1); }

  /* footer */
  .ir-footer {
    background: #0B2545; color: rgba(255,255,255,0.7);
    padding: 64px 1rem 32px;
  }
  .ir-footer-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
  }
  @media (max-width: 800px) { .ir-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
  @media (max-width: 480px) { .ir-footer-grid { grid-template-columns: 1fr; } }
  .ir-footer-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 700; color: #fff; margin-bottom: 14px;
  }
  .ir-footer-brand-desc { font-size: 0.82rem; line-height: 1.7; color: rgba(255,255,255,0.55); margin-bottom: 20px; }
  .ir-footer-langs { display: flex; gap: 8px; flex-wrap: wrap; }
  .ir-footer-lang {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.6); font-size: 0.72rem; padding: 4px 10px; border-radius: 6px;
    cursor: pointer; font-family: 'Inter', sans-serif;
  }
  .ir-footer-col-title { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 16px; }
  .ir-footer-link {
    display: block; font-size: 0.85rem; color: rgba(255,255,255,0.65);
    margin-bottom: 10px; cursor: pointer; background: none; border: none;
    font-family: 'Inter', sans-serif; padding: 0; text-align: left;
    transition: color 0.12s;
  }
  .ir-footer-link:hover { color: #fff; }
  .ir-footer-bottom {
    max-width: 1200px; margin: 48px auto 0;
    padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08);
    display: flex; justify-content: space-between; align-items: center; flex-wrap: gap;
    font-size: 0.78rem; color: rgba(255,255,255,0.4);
    flex-wrap: wrap; gap: 12px;
  }
  .ir-footer-bottom-links { display: flex; gap: 24px; }
  .ir-footer-bottom-link { cursor: pointer; transition: color 0.12s; background: none; border: none; font-family: 'Inter', sans-serif; font-size: 0.78rem; color: rgba(255,255,255,0.4); }
  .ir-footer-bottom-link:hover { color: rgba(255,255,255,0.8); }

  /* loading */
  .ir-spinner {
    display: flex; justify-content: center; padding: 48px 0;
  }
  .ir-spin {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid #e8f0f8;
    border-top-color: #0CB8B6;
    animation: ir-spin 0.7s linear infinite;
  }
  @keyframes ir-spin { to { transform: rotate(360deg); } }
  .ir-empty { text-align: center; padding: 48px 0; font-size: 0.9rem; color: #94a3b8; }

  /* mobile-only link */
  .ir-mobile-more { margin-top: 32px; text-align: center; display: none; }
  @media (max-width: 768px) { .ir-mobile-more { display: block; } }
  .ir-desktop-only { display: flex; }
  @media (max-width: 768px) { .ir-desktop-only { display: none; } }

  /* stats */
  @media (max-width: 600px) {
    .ir-stats-bar { grid-template-columns: repeat(2, 1fr); }
    .ir-stat-item:nth-child(2) { border-right: none; }
  }
`;

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

  const hasInitialData = initialCategories && initialFeaturedProperties && initialRestaurants
    && initialTours && initialActivities && initialTransfers && initialTourPackages;

  useEffect(() => {
    if (hasInitialData) { setLoading(false); return; }
    async function load() {
      try {
        const [cats, props, rests, ts, acts, trs, pkgs] = await Promise.all([
          getCategories(),
          getProperties({ limit: 4, max_price: 50000 }),
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
      } catch (err) { console.error("Failed to load landing data", err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    onNavigate("search", searchQuery ? { query: searchQuery } : undefined);
  }

  const cityCounts = [
    { name: "Чолпон-Ата", slug: "cholpon-ata", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop" },
    { name: "Бостери", slug: "bosteri", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop" },
    { name: "Кара-Ой", slug: "kara-oy", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=600&fit=crop" },
    { name: "Чок-Тал", slug: "chok-tal", image: "https://images.unsplash.com/photo-1482192505345-5852bda519bb?w=400&h=600&fit=crop" },
    { name: "Тамчы", slug: "tamchy", image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=400&h=600&fit=crop" },
  ];

  return (
    <div className="ir-landing">
      <style>{styles}</style>
      <SEO
        title="Отдых на Иссык-Куле — бронирование жилья, отелей, туров, ресторанов и трансферов"
        description="IssykRelax — крупнейший маркетплейс отдыха на Иссык-Куле. Бронируйте жильё, отели, коттеджи, юрты, туры, рестораны, трансферы и активный отдых в Чолпон-Ате, Бостери, Кара-Ое. Лучшие цены, реальные отзывы."
        canonical="/"
        jsonLd={[localBusinessSchema(), searchActionSchema()]}
      />

      {/* ══════════ HERO ══════════ */}
      <section className="ir-hero">
        <div className="ir-hero-bg" />
        <div className="ir-hero-overlay" />
        <div className="ir-hero-content">
          <div className="ir-hero-eyebrow">
            <span>🏔️</span>
            <span>№1 маркетплейс Иссык-Куля</span>
          </div>
          <h1 className="ir-hero-title">
            Откройте Иссык-Куль<br />
            <em>по-настоящему</em>
          </h1>
          <p className="ir-hero-sub">
            Жильё, туры, рестораны и трансферы — всё для вашего идеального отпуска
          </p>

          <form onSubmit={handleSearch} className="ir-search-box">
            <Search size={20} color="#0CB8B6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Коттедж, юрта, тур, ресторан... Чолпон-Ата, Бостери..."
              className="ir-search-input"
            />
            <button type="submit" className="ir-search-btn">Найти</button>
          </form>

          <div className="ir-tags">
            {["Пляж", "Юрты", "Горы", "Семьям", "С питанием", "SPA"].map((tag) => (
              <button key={tag} type="button" onClick={() => onNavigate("search", { query: tag })} className="ir-tag">
                {tag}
              </button>
            ))}
          </div>

          {/* stats bar */}
          <div className="ir-stats-bar">
            {[
              { val: "500+", label: "Объектов жилья" },
              { val: "120+", label: "Туров и экскурсий" },
              { val: "80+", label: "Ресторанов" },
              { val: "50+", label: "Трансферов" },
            ].map((s) => (
              <div key={s.label} className="ir-stat-item">
                <div className="ir-stat-value">{s.val}</div>
                <div className="ir-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* wave */}
        <svg className="ir-wave" style={{ position: "absolute", bottom: -2, left: 0, right: 0 }} viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#F8FAFB" />
        </svg>
      </section>

      {/* ══════════ CATEGORIES ══════════ */}
      <section className="ir-section">
        <div className="ir-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="ir-section-label">Категории</div>
            <h2 className="ir-section-title">Найдите всё для отдыха</h2>
            <p className="ir-section-desc">От уютной юрты до пятизвёздочного курорта</p>
          </div>
          <div className="ir-cats">
            {categories.map((cat) => {
              const c = CATEGORY_ICONS[cat.name] || DEFAULT_ICON;
              const CatIcon = c.icon;
              return (
                <button key={cat.id} className="ir-cat-btn" onClick={() => onNavigate("search", { category_id: cat.id })}>
                  <div className="ir-cat-icon" style={{ background: `${c.color}18`, border: `2px solid ${c.color}25` }}>
                    <CatIcon size={26} color={c.color} />
                  </div>
                  <span className="ir-cat-name">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section className="ir-section ir-section-alt">
        <div className="ir-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="ir-section-label">Услуги</div>
            <h2 className="ir-section-title">Всё для вашего отпуска</h2>
            <p className="ir-section-desc">Пять шагов к незабываемому путешествию</p>
          </div>
          <div className="ir-services">
            {SERVICE_LINKS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.page} className="ir-service-card" onClick={() => onNavigate(s.page)}>
                  <div className="ir-service-icon" style={{ background: s.bg, color: s.color }}>
                    <Icon size={26} />
                  </div>
                  <div className="ir-service-name">{s.label}</div>
                  <div className="ir-service-desc">{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section className="ir-section" style={{ paddingBottom: 0 }}>
        <div className="ir-container">
          <div className="ir-about-grid">
            <div className="ir-about-img">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop" alt="Иссык-Куль" />
              <div className="ir-about-img-badge">
                <span className="ir-about-img-badge-icon">🌊</span>
                <div>
                  <div className="ir-about-img-badge-text">6 236 км²</div>
                  <div className="ir-about-img-badge-sub">Площадь озера</div>
                </div>
              </div>
            </div>
            <div className="ir-about-text">
              <div className="ir-section-label">Об Иссык-Куле</div>
              <h2 className="ir-section-title">Жемчужина<br />Кыргызстана</h2>
              <p>
                Иссык-Куль — одно из крупнейших высокогорных озёр мира, расположенное в сердце Тянь-Шаня.
                Благодаря уникальному микроклимату вода не замерзает зимой, а летом прогревается до +24°C.
              </p>
              <p>
                Более 180 километров золотистых пляжей, величественные горные хребты и богатое
                культурное наследие кочевого народа привлекают путешественников со всего мира.
              </p>
              <p>
                IssykRelax объединяет лучшие объекты размещения, рестораны, туры и услуги —
                всё в одном месте, без посредников.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ RESTAURANTS ══════════ */}
      <section className="ir-section ir-section-alt">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Еда и напитки</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Лучшие рестораны</h2>
              <p className="ir-section-desc">От бешбармака до европейских деликатесов</p>
            </div>
            <button className="ir-link-btn ir-desktop-only" onClick={() => onNavigate("restaurants")}>
              Все рестораны <ArrowRight size={16} />
            </button>
          </div>
          {loading ? <div className="ir-spinner"><div className="ir-spin" /></div>
            : restaurants.length === 0 ? <div className="ir-empty">Рестораны скоро появятся</div>
            : (
              <div className="ir-grid-3">
                {restaurants.map((r) => (
                  <button key={r.id} className="ir-card" onClick={() => onNavigate("restaurant", { restaurant_id: r.id })}>
                    <div className="ir-card-img" style={{ height: 200 }}>
                      <ImgWithFallback
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                        alt={r.name} className="w-full h-full object-cover"
                      />
                      {r.price_range && <div className="ir-badge-overlay">{r.price_range}</div>}
                    </div>
                    <div className="ir-card-body">
                      <div className="ir-card-title">{r.name}</div>
                      <div className="ir-card-meta">
                        {r.cuisine_type && <span className="ir-cuisine-chip">{CUISINE_FLAG[r.cuisine_type] || ""} {r.cuisine_type}</span>}
                        {r.city?.name && <span className="ir-card-meta-item"><MapPin size={11} />{r.city.name}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          <div className="ir-mobile-more">
            <button className="ir-link-btn" style={{ display: "inline-flex" }} onClick={() => onNavigate("restaurants")}>
              Все рестораны <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ TOURS ══════════ */}
      <section className="ir-section">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Экскурсии</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Туры по Иссык-Кулю</h2>
              <p className="ir-section-desc">Откройте горы, ущелья и тайные места</p>
            </div>
            <button className="ir-link-btn ir-desktop-only" onClick={() => onNavigate("tours")}>
              Все туры <ArrowRight size={16} />
            </button>
          </div>
          {loading ? <div className="ir-spinner"><div className="ir-spin" /></div>
            : tours.length === 0 ? <div className="ir-empty">Туры скоро появятся</div>
            : (
              <div className="ir-grid-3">
                {tours.map((t) => (
                  <button key={t.id} className="ir-card" onClick={() => onNavigate("tour", { tour_id: t.id })}>
                    <div className="ir-card-img" style={{ height: 200 }}>
                      <ImgWithFallback
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                        alt={t.title} className="w-full h-full object-cover"
                      />
                      <div className="ir-price-overlay">{t.price.toLocaleString()} Сом</div>
                    </div>
                    <div className="ir-card-body">
                      <div className="ir-card-title">{t.title}</div>
                      <div className="ir-card-meta">
                        <span className="ir-card-meta-item"><Clock size={12} />{t.duration_days} {t.duration_days === 1 ? "день" : "дней"}</span>
                        <span className="ir-card-meta-item"><Users size={12} />до {t.max_guests} чел.</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          <div className="ir-mobile-more">
            <button className="ir-link-btn" style={{ display: "inline-flex" }} onClick={() => onNavigate("tours")}>
              Все туры <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ DESTINATIONS ══════════ */}
      <section className="ir-section ir-section-alt">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Направления</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Популярные места</h2>
              <p className="ir-section-desc">Самые любимые курорты побережья</p>
            </div>
          </div>
          <div className="ir-dest-grid">
            {cityCounts.map((dest) => (
              <button key={dest.name} className="ir-dest-card" onClick={() => onNavigate("city", { city_slug: dest.slug })}>
                <img src={dest.image} alt={dest.name} />
                <div className="ir-dest-overlay" />
                <div className="ir-dest-info">
                  <div className="ir-dest-name">{dest.name}</div>
                  <div className="ir-dest-sub">Иссык-Куль</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ACTIVITIES ══════════ */}
      <section className="ir-section">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Активности</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Активный отдых</h2>
              <p className="ir-section-desc">Адреналин и впечатления на весь отпуск</p>
            </div>
            <button className="ir-link-btn ir-desktop-only" onClick={() => onNavigate("activities")}>
              Все активности <ArrowRight size={16} />
            </button>
          </div>
          {loading ? <div className="ir-spinner"><div className="ir-spin" /></div>
            : activities.length === 0 ? <div className="ir-empty">Активности скоро появятся</div>
            : (
              <div className="ir-grid-3">
                {activities.map((a) => (
                  <button key={a.id} className="ir-card" onClick={() => onNavigate("activity", { activity_id: a.id })}>
                    <div className="ir-card-img" style={{ height: 200 }}>
                      <ImgWithFallback
                        src="https://images.unsplash.com/photo-1530866495561-507c9fa053fc?w=600&h=400&fit=crop"
                        alt={a.title} className="w-full h-full object-cover"
                      />
                      <div className="ir-price-overlay">{a.price.toLocaleString()} Сом</div>
                    </div>
                    <div className="ir-card-body">
                      <div className="ir-card-title">{a.title}</div>
                      <div className="ir-card-meta">
                        {a.duration_minutes && <span className="ir-card-meta-item"><Clock size={12} />{a.duration_minutes} мин</span>}
                        <span className="ir-card-meta-item"><Users size={12} />до {a.max_participants} чел.</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          <div className="ir-mobile-more">
            <button className="ir-link-btn" style={{ display: "inline-flex" }} onClick={() => onNavigate("activities")}>
              Все активности <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ TRANSFERS ══════════ */}
      <section className="ir-section ir-section-alt">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Транспорт</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Трансферы</h2>
              <p className="ir-section-desc">Комфортные поездки по всему побережью</p>
            </div>
            <button className="ir-link-btn ir-desktop-only" onClick={() => onNavigate("transfers")}>
              Все трансферы <ArrowRight size={16} />
            </button>
          </div>
          {loading ? <div className="ir-spinner"><div className="ir-spin" /></div>
            : transfers.length === 0 ? <div className="ir-empty">Трансферы скоро появятся</div>
            : (
              <div className="ir-grid-3">
                {transfers.map((tr) => (
                  <button key={tr.id} className="ir-card" onClick={() => onNavigate("transfer", { transfer_id: tr.id })}>
                    <div className="ir-transfer-thumb" style={{ background: "linear-gradient(135deg, #e8f4fd 0%, #d0f5f4 100%)" }}>
                      <span style={{ fontSize: "4rem" }}>{VEHICLE_EMOJI[tr.vehicle_type || "sedan"] || "🚗"}</span>
                      <div className="ir-price-overlay">{tr.price.toLocaleString()} Сом</div>
                    </div>
                    <div className="ir-card-body">
                      <div className="ir-card-title">{tr.title}</div>
                      <div className="ir-card-meta">
                        <span className="ir-card-meta-item"><MapPin size={11} />{tr.from_location}</span>
                        <ArrowRight size={11} />
                        <span className="ir-card-meta-item"><MapPin size={11} />{tr.to_location}</span>
                      </div>
                      {tr.duration_minutes && (
                        <div className="ir-card-meta" style={{ marginTop: 6 }}>
                          <span className="ir-card-meta-item"><Clock size={11} />{tr.duration_minutes} мин</span>
                          <span className="ir-card-meta-item"><Users size={11} />до {tr.max_passengers} чел.</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          <div className="ir-mobile-more">
            <button className="ir-link-btn" style={{ display: "inline-flex" }} onClick={() => onNavigate("transfers")}>
              Все трансферы <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ TOUR PACKAGES ══════════ */}
      <section className="ir-section">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Пакеты</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Пакетные туры</h2>
              <p className="ir-section-desc">Готовые решения — жильё, питание, экскурсии</p>
            </div>
            <button className="ir-link-btn ir-desktop-only" onClick={() => onNavigate("tour-packages")}>
              Все пакеты <ArrowRight size={16} />
            </button>
          </div>
          {loading ? <div className="ir-spinner"><div className="ir-spin" /></div>
            : packages.length === 0 ? <div className="ir-empty">Пакетные туры скоро появятся</div>
            : (
              <div className="ir-grid-3">
                {packages.map((p) => (
                  <button key={p.id} className="ir-card" onClick={() => onNavigate("tour-package", { package_id: p.id })}>
                    <div className="ir-card-img" style={{ height: 200 }}>
                      <ImgWithFallback
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
                        alt={p.title} className="w-full h-full object-cover"
                      />
                      <div className="ir-badge-green">{p.duration_days} {p.duration_days === 1 ? "день" : "дней"}</div>
                      <div className="ir-price-overlay">{p.price.toLocaleString()} Сом</div>
                    </div>
                    <div className="ir-card-body">
                      <div className="ir-card-title">{p.title}</div>
                      <div className="ir-card-meta">
                        <span className="ir-card-meta-item"><Users size={12} />до {p.max_guests} чел.</span>
                      </div>
                      {p.includes && <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "8px 0 0", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.includes}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          <div className="ir-mobile-more">
            <button className="ir-link-btn" style={{ display: "inline-flex" }} onClick={() => onNavigate("tour-packages")}>
              Все пакеты <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED PROPERTIES ══════════ */}
      <section className="ir-section ir-section-alt">
        <div className="ir-container">
          <div className="ir-header">
            <div>
              <div className="ir-section-label">Жильё</div>
              <h2 className="ir-section-title" style={{ marginBottom: 6 }}>Лучшие предложения</h2>
              <p className="ir-section-desc">Отборные объекты с высоким рейтингом</p>
            </div>
            <button className="ir-link-btn ir-desktop-only" onClick={() => onNavigate("search")}>
              Смотреть все <ArrowRight size={16} />
            </button>
          </div>
          {loading ? <div className="ir-spinner"><div className="ir-spin" /></div>
            : (
              <div className="ir-grid-4">
                {featured.map((listing) => (
                  <button key={listing.id} className="ir-card" onClick={() => onNavigate("property", { property_id: listing.id })}>
                    <div className="ir-card-img" style={{ height: 210 }}>
                      <ImgWithFallback
                        src={listing.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"}
                        alt={listing.title} className="w-full h-full object-cover"
                      />
                      {listing.status === "active" && <div className="ir-badge-blue">Доступно</div>}
                    </div>
                    <div className="ir-card-body">
                      <div className="ir-card-title">{listing.title}</div>
                      <div className="ir-card-meta" style={{ marginBottom: 10 }}>
                        <span className="ir-card-meta-item"><MapPin size={12} />{listing.city?.name || "Иссык-Куль"}</span>
                      </div>
                      <div style={{ marginTop: "auto" }}>
                        <span className="ir-price-main">{listing.price_per_night.toLocaleString()} Сом</span>
                        <span className="ir-price-unit"> / ночь</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="ir-section">
        <div className="ir-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="ir-section-label">Отзывы</div>
            <h2 className="ir-section-title">Что говорят путешественники</h2>
          </div>
          <div className="ir-grid-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="ir-testimonial">
                <div className="ir-stars">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="#E8B86D" stroke="#E8B86D" />)}
                </div>
                <p className="ir-quote">"{t.text}"</p>
                <div className="ir-reviewer">
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div className="ir-reviewer-name">{t.name}</div>
                    <div className="ir-reviewer-city">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY US ══════════ */}
      <section className="ir-section ir-section-alt">
        <div className="ir-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="ir-section-label">Преимущества</div>
            <h2 className="ir-section-title">Почему выбирают IssykRelax</h2>
            <p className="ir-section-desc" style={{ maxWidth: 560, margin: "0 auto" }}>
              Мы лично проверяем каждого партнёра и поддерживаем путешественников 24/7
            </p>
          </div>
          <div className="ir-grid-3">
            {[
              { icon: Shield, title: "Безопасное бронирование", desc: "Все объекты проходят проверку. Ваши данные под надёжной защитой — никакого мошенничества." },
              { icon: Zap, title: "Мгновенное подтверждение", desc: "Бронируйте в один клик — подтверждение приходит моментально, без звонков и ожидания." },
              { icon: Star, title: "Реальные отзывы", desc: "Только настоящие гости могут оставлять отзывы. Вы всегда знаете, что вас ждёт." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="ir-why-card">
                  <div className="ir-why-icon"><Icon size={22} color="#0CB8B6" /></div>
                  <div className="ir-why-title">{item.title}</div>
                  <p className="ir-why-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="ir-section">
        <div className="ir-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="ir-section-label">Как это работает</div>
            <h2 className="ir-section-title">Четыре шага<br />до идеального отпуска</h2>
          </div>
          <div className="ir-steps">
            {[
              { n: "1", title: "Найдите", desc: "Ищите жильё, туры, рестораны или трансферы по категориям и фильтрам" },
              { n: "2", title: "Сравните", desc: "Изучайте фотографии, реальные отзывы гостей и сравнивайте цены" },
              { n: "3", title: "Забронируйте", desc: "Один клик — мгновенное подтверждение без звонков и переплат" },
              { n: "4", title: "Отдохните", desc: "Приезжайте и наслаждайтесь, а мы всегда на связи если нужна помощь" },
            ].map((item) => (
              <div key={item.n} className="ir-step">
                <div className="ir-step-num">{item.n}</div>
                <div className="ir-step-title">{item.title}</div>
                <p className="ir-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BUSINESS CTA ══════════ */}
      <div className="ir-cta-section">
        <div className="ir-cta-content">
          <div className="ir-hero-eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>🏢 Для бизнеса</div>
          <h2 className="ir-cta-title">Вы — владелец<br />бизнеса?</h2>
          <p className="ir-cta-desc">Разместите свой объект на IssykRelax и получайте бронирования от тысяч туристов из России, Казахстана, Узбекистана и всего мира.</p>
          <div className="ir-cta-features">
            {["Бесплатное размещение", "Свой календарь брони", "Аналитика и доходы", "Верификация бизнеса"].map((f) => (
              <div key={f} className="ir-cta-feat"><CheckCircle size={15} />{f}</div>
            ))}
          </div>
          <div className="ir-cta-btns">
            <button className="ir-cta-btn-primary" onClick={() => onNavigate("add-listing")}>Разместить объект бесплатно</button>
            <button className="ir-cta-btn-secondary" onClick={() => onNavigate("pricing")}>Посмотреть тарифы</button>
          </div>
        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="ir-footer">
        <div className="ir-footer-grid">
          <div>
            <div className="ir-footer-brand-name">IssykRelax</div>
            <p className="ir-footer-brand-desc">Крупнейший маркетплейс для отдыха на Иссык-Куле. Жильё, рестораны, туры и транспорт — всё в одном месте.</p>
            <div className="ir-footer-langs">
              {["🇷🇺 RU", "🇺🇿 UZ", "🇰🇿 KZ", "🌍 EN"].map((lang) => (
                <button key={lang} className="ir-footer-lang">{lang}</button>
              ))}
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
              <div className="ir-footer-col-title">{col.title}</div>
              {col.links.map((link) => (
                <button key={link.label} className="ir-footer-link" onClick={() => onNavigate(link.page)}>
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="ir-footer-bottom">
          <span>© 2024 IssykRelax. Все права защищены.</span>
          <div className="ir-footer-bottom-links">
            <button className="ir-footer-bottom-link" onClick={() => onNavigate("privacy")}>Конфиденциальность</button>
            <button className="ir-footer-bottom-link" onClick={() => onNavigate("terms")}>Условия</button>
            <button className="ir-footer-bottom-link" onClick={() => onNavigate("faq")}>FAQ</button>
          </div>
        </div>
      </footer>
    </div>
  );
}