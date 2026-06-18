import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { SearchResults } from "./components/SearchResults";
import { PropertyDetails } from "./components/PropertyDetails";
import { RestaurantsPage } from "./components/RestaurantsPage";
import { ToursPage } from "./components/ToursPage";
import { UserDashboard } from "./components/UserDashboard";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { AddListingWizard } from "./components/AddListingWizard";
import { PricingPage } from "./components/PricingPage";
import { AdminPanel } from "./components/AdminPanel";
import { AboutPage } from "./components/AboutPage";
import { FeedbackPage } from "./components/FeedbackPage";
import { Toaster } from "./components/ui/sonner";

export type Page =
  | "landing"
  | "search"
  | "property"
  | "restaurants"
  | "tours"
  | "dashboard"
  | "owner-dashboard"
  | "add-listing"
  | "pricing"
  | "admin"
  | "about"
  | "feedback";

export interface NavParams {
  property_id?: string;
  query?: string;
  category_id?: string;
  city_id?: string;
  check_in?: string;
  check_out?: string;
  guests?: string;
  offset?: string;
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
  switch (path) {
    case "/dashboard": return { page: "dashboard", params: {} };
    case "/owner-dashboard": return { page: "owner-dashboard", params: {} };
    case "/add-listing": return { page: "add-listing", params: {} };
    case "/admin": return { page: "admin", params: {} };
    case "/restaurants": return { page: "restaurants", params: {} };
    case "/tours": return { page: "tours", params: {} };
    case "/pricing": return { page: "pricing", params: {} };
    case "/about": return { page: "about", params: {} };
    case "/feedback": return { page: "feedback", params: {} };
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

  const userRole = user?.role === "admin" ? "admin" : user?.role === "owner" ? "owner" : "tourist";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--lake-blue)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-sans)", background: "var(--background)" }}>
      {showNav && (
        <Navigation
          currentPage={currentPage}
          onNavigate={navigate}
          isLoggedIn={!!user}
          userRole={userRole}
        />
      )}

      <Toaster position="top-right" richColors />
      <main className="pb-16 md:pb-0">
        {currentPage === "landing" && <LandingPage onNavigate={navigate} />}
        {currentPage === "search" && <SearchResults onNavigate={navigate} params={navParams} />}
        {currentPage === "property" && <PropertyDetails onNavigate={navigate} propertyId={navParams.property_id} />}
        {currentPage === "restaurants" && <RestaurantsPage onNavigate={navigate} />}
        {currentPage === "tours" && <ToursPage onNavigate={navigate} />}
        {currentPage === "dashboard" && <UserDashboard onNavigate={navigate} />}
        {currentPage === "owner-dashboard" && <OwnerDashboard onNavigate={navigate} />}
        {currentPage === "add-listing" && <AddListingWizard onNavigate={navigate} />}
        {currentPage === "pricing" && <PricingPage onNavigate={navigate} />}
        {currentPage === "admin" && <AdminPanel onNavigate={navigate} />}
        {currentPage === "about" && <AboutPage onNavigate={navigate} />}
        {currentPage === "feedback" && <FeedbackPage onNavigate={navigate} />}
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
