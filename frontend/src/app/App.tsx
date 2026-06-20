import { useState, useEffect, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { LayoutSEO } from "./components/LayoutSEO";
import { SearchResults } from "./components/SearchResults";
import { PropertyDetails } from "./components/PropertyDetails";
import { RestaurantsPage } from "./components/RestaurantsPage";
import { ToursPage } from "./components/ToursPage";
import { ActivitiesPage } from "./components/ActivitiesPage";
import { TransfersPage } from "./components/TransfersPage";
import { TourPackagesPage } from "./components/TourPackagesPage";
import { UserDashboard } from "./components/UserDashboard";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { AddListingWizard } from "./components/AddListingWizard";
import { PricingPage } from "./components/PricingPage";
import { AboutPage } from "./components/AboutPage";
import { FeedbackPage } from "./components/FeedbackPage";
import { CityPage } from "./components/CityPage";
import { CategoryPage } from "./components/CategoryPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { FaqPage } from "./components/FaqPage";
import { ActivityDetailPage } from "./components/ActivityDetailPage";
import { TransferDetailPage } from "./components/TransferDetailPage";
import { TourDetailPage } from "./components/TourDetailPage";
import { TourPackageDetailPage } from "./components/TourPackageDetailPage";
import { RestaurantDetailPage } from "./components/RestaurantDetailPage";
import { Toaster } from "./components/ui/sonner";

const AdminPanel = lazy(() => import("./components/AdminPanel").then((m) => ({ default: m.AdminPanel })));
const ModeratorDashboard = lazy(() => import("./components/ModeratorDashboard").then((m) => ({ default: m.ModeratorDashboard })));
const DriverDashboard = lazy(() => import("./components/DriverDashboard").then((m) => ({ default: m.DriverDashboard })));
const GuideDashboard = lazy(() => import("./components/GuideDashboard").then((m) => ({ default: m.GuideDashboard })));
const ActivityProviderDashboard = lazy(() => import("./components/ActivityProviderDashboard").then((m) => ({ default: m.ActivityProviderDashboard })));
const RestaurantDashboard = lazy(() => import("./components/RestaurantDashboard").then((m) => ({ default: m.RestaurantDashboard })));
const AgencyDashboard = lazy(() => import("./components/AgencyDashboard").then((m) => ({ default: m.AgencyDashboard })));
const ConciergeDashboard = lazy(() => import("./components/ConciergeDashboard").then((m) => ({ default: m.ConciergeDashboard })));
const TranslatorDashboard = lazy(() => import("./components/TranslatorDashboard").then((m) => ({ default: m.TranslatorDashboard })));

export type Page =
  | "landing"
  | "search"
  | "property"
  | "restaurants"
  | "tours"
  | "dashboard"
  | "owner-dashboard"
  | "driver-dashboard"
  | "guide-dashboard"
  | "activity-dashboard"
  | "restaurant-dashboard"
  | "agency-dashboard"
  | "concierge-dashboard"
  | "translator-dashboard"
  | "moderator"
  | "add-listing"
  | "pricing"
  | "admin"
  | "about"
  | "feedback"
  | "city"
  | "category"
  | "login"
  | "register"
  | "privacy"
  | "terms"
  | "faq"
  | "activities"
  | "transfers"
  | "tour-packages"
  | "activity"
  | "transfer"
  | "tour"
  | "tour-package"
  | "restaurant";

export interface NavParams {
  property_id?: string;
  query?: string;
  category_id?: string;
  city_id?: string;
  city_slug?: string;
  category_slug?: string;
  check_in?: string;
  check_out?: string;
  guests?: string;
  offset?: string;
  activity_id?: string;
  transfer_id?: string;
  tour_id?: string;
  pkg_id?: string;
  restaurant_id?: string;
}

function parseURL(): { page: Page; params: NavParams } {
  const path = window.location.pathname;
  const sp = new URLSearchParams(window.location.search);

  if (path.startsWith("/property/")) {
    return { page: "property", params: { property_id: path.split("/")[2] } };
  }
  if (path.startsWith("/search")) {
    return { page: "search", params: Object.fromEntries(sp) as NavParams };
  }
  if (path.startsWith("/city/")) {
    const slug = path.split("/")[2];
    return { page: "city", params: { city_slug: slug } };
  }
  if (path.startsWith("/category/")) {
    const slug = path.split("/")[2];
    return { page: "category", params: { category_slug: slug } };
  }
  if (path.startsWith("/activity/")) {
    return { page: "activity", params: { activity_id: path.split("/")[2] } };
  }
  if (path.startsWith("/transfer/")) {
    return { page: "transfer", params: { transfer_id: path.split("/")[2] } };
  }
  if (path.startsWith("/tour/")) {
    return { page: "tour", params: { tour_id: path.split("/")[2] } };
  }
  if (path.startsWith("/tour-package/")) {
    return { page: "tour-package", params: { pkg_id: path.split("/")[2] } };
  }
  if (path.startsWith("/restaurant/")) {
    return { page: "restaurant", params: { restaurant_id: path.split("/")[2] } };
  }
  switch (path) {
    case "/dashboard": return { page: "dashboard", params: {} };
    case "/owner-dashboard": return { page: "owner-dashboard", params: {} };
    case "/driver-dashboard": return { page: "driver-dashboard", params: {} };
    case "/guide-dashboard": return { page: "guide-dashboard", params: {} };
    case "/activity-dashboard": return { page: "activity-dashboard", params: {} };
    case "/restaurant-dashboard": return { page: "restaurant-dashboard", params: {} };
    case "/agency-dashboard": return { page: "agency-dashboard", params: {} };
    case "/concierge-dashboard": return { page: "concierge-dashboard", params: {} };
    case "/translator-dashboard": return { page: "translator-dashboard", params: {} };
    case "/moderator": return { page: "moderator", params: {} };
    case "/add-listing": return { page: "add-listing", params: {} };
    case "/admin": return { page: "admin", params: {} };
    case "/restaurants": return { page: "restaurants", params: {} };
    case "/tours": return { page: "tours", params: {} };
    case "/pricing": return { page: "pricing", params: {} };
    case "/about": return { page: "about", params: {} };
    case "/feedback": return { page: "feedback", params: {} };
    case "/login": return { page: "login", params: {} };
    case "/register": return { page: "register", params: {} };
    case "/privacy": return { page: "privacy", params: {} };
    case "/terms": return { page: "terms", params: {} };
    case "/faq": return { page: "faq", params: {} };
    case "/activities": return { page: "activities", params: {} };
    case "/transfers": return { page: "transfers", params: {} };
    case "/tour-packages": return { page: "tour-packages", params: {} };
    default: return { page: "landing", params: {} };
  }
}

function AppContent() {
  const [{ page: currentPage, params: navParams }, setRoute] = useState<{ page: Page; params: NavParams }>(parseURL);
  const { user, loading } = useAuth();

  useEffect(() => {
    const onPop = () => setRoute(parseURL());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (page: string, extra?: NavParams) => {
    let path: string;
    if (page === "property" && extra?.property_id) {
      path = `/property/${extra.property_id}`;
    } else if (page === "city" && extra?.city_slug) {
      path = `/city/${extra.city_slug}`;
    } else if (page === "category" && extra?.category_slug) {
      path = `/category/${extra.category_slug}`;
    } else if (page === "activity" && extra?.activity_id) {
      path = `/activity/${extra.activity_id}`;
    } else if (page === "transfer" && extra?.transfer_id) {
      path = `/transfer/${extra.transfer_id}`;
    } else if (page === "tour" && extra?.tour_id) {
      path = `/tour/${extra.tour_id}`;
    } else if (page === "tour-package" && extra?.pkg_id) {
      path = `/tour-package/${extra.pkg_id}`;
    } else if (page === "restaurant" && extra?.restaurant_id) {
      path = `/restaurant/${extra.restaurant_id}`;
    } else if (page === "search") {
      const sp = new URLSearchParams();
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => { if (v !== undefined) sp.set(k, v); });
      }
      path = `/search${sp.toString() ? `?${sp}` : ""}`;
    } else if (page === "landing") {
      path = "/";
    } else {
      path = `/${page}`;
    }
    window.history.pushState({}, "", path);
    setRoute({ page: page as Page, params: extra || {} });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const noNavPages: Page[] = ["add-listing"];
  const showNav = !noNavPages.includes(currentPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-sans)", background: "var(--background)" }}>
      <LayoutSEO />
      {showNav && (
        <Navigation
          currentPage={currentPage}
          onNavigate={navigate}
          isLoggedIn={!!user}
        />
      )}

      <Toaster position="top-right" richColors />
      <main className="pb-16 md:pb-0">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--lake-blue)" }} /></div>}>
        {currentPage === "landing" && <LandingPage onNavigate={navigate} />}
        {currentPage === "search" && <SearchResults onNavigate={navigate} params={navParams} />}
        {currentPage === "property" && <PropertyDetails onNavigate={navigate} propertyId={navParams.property_id} />}
        {currentPage === "restaurants" && <RestaurantsPage onNavigate={navigate} />}
        {currentPage === "tours" && <ToursPage onNavigate={navigate} />}
        {currentPage === "dashboard" && <UserDashboard onNavigate={navigate} />}
        {currentPage === "owner-dashboard" && <OwnerDashboard onNavigate={navigate} />}
        {currentPage === "driver-dashboard" && <DriverDashboard onNavigate={navigate} />}
        {currentPage === "guide-dashboard" && <GuideDashboard onNavigate={navigate} />}
        {currentPage === "activity-dashboard" && <ActivityProviderDashboard onNavigate={navigate} />}
        {currentPage === "restaurant-dashboard" && <RestaurantDashboard onNavigate={navigate} />}
        {currentPage === "agency-dashboard" && <AgencyDashboard onNavigate={navigate} />}
        {currentPage === "concierge-dashboard" && <ConciergeDashboard onNavigate={navigate} />}
        {currentPage === "translator-dashboard" && <TranslatorDashboard onNavigate={navigate} />}
        {currentPage === "moderator" && <ModeratorDashboard onNavigate={navigate} />}
        {currentPage === "add-listing" && <AddListingWizard onNavigate={navigate} />}
        {currentPage === "pricing" && <PricingPage onNavigate={navigate} />}
        {currentPage === "admin" && <AdminPanel onNavigate={navigate} />}
        {currentPage === "about" && <AboutPage onNavigate={navigate} />}
        {currentPage === "feedback" && <FeedbackPage onNavigate={navigate} />}
        {currentPage === "city" && <CityPage onNavigate={navigate} citySlug={navParams.city_slug} />}
        {currentPage === "category" && <CategoryPage onNavigate={navigate} categorySlug={navParams.category_slug} />}
        {currentPage === "login" && <LoginPage onNavigate={navigate} />}
        {currentPage === "register" && <RegisterPage onNavigate={navigate} />}
        {currentPage === "privacy" && <PrivacyPage onNavigate={navigate} />}
        {currentPage === "terms" && <TermsPage onNavigate={navigate} />}
        {currentPage === "faq" && <FaqPage onNavigate={navigate} />}
        {currentPage === "activities" && <ActivitiesPage onNavigate={navigate} />}
        {currentPage === "transfers" && <TransfersPage onNavigate={navigate} />}
        {currentPage === "tour-packages" && <TourPackagesPage onNavigate={navigate} />}
        {currentPage === "activity" && <ActivityDetailPage onNavigate={navigate} activityId={navParams.activity_id} />}
        {currentPage === "transfer" && <TransferDetailPage onNavigate={navigate} transferId={navParams.transfer_id} />}
        {currentPage === "tour" && <TourDetailPage onNavigate={navigate} tourId={navParams.tour_id} />}
        {currentPage === "tour-package" && <TourPackageDetailPage onNavigate={navigate} pkgId={navParams.pkg_id} />}
        {currentPage === "restaurant" && <RestaurantDetailPage onNavigate={navigate} restaurantId={navParams.restaurant_id} />}
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
