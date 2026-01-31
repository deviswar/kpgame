// Fresh deployment trigger - v1.0.5 - Seamless game flow
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

// Eagerly import ALL game screens for seamless transitions (no loading between scenes)
import WelcomePage from "./pages/WelcomePage";
import FeedPage from "./pages/FeedPage";
import CowFightPage from "./pages/CowFightPage";
import MilkHospitalPage from "./pages/MilkHospitalPage";
import AirplanePage from "./pages/AirplanePage";

// Only lazy load non-game pages
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

const queryClient = new QueryClient();

// Minimal loading fallback (only for admin/404)
const LoadingFallback = () => (
  <div className="min-h-screen min-h-[100dvh] game-gradient flex items-center justify-center">
    <div className="text-white text-xl animate-pulse">Loading...</div>
  </div>
);

// Global error handler component
const GlobalErrorHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", event.reason);
      event.preventDefault();
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);
    
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <GlobalErrorHandler>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Game screens - eagerly loaded for seamless flow */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/cow-fight" element={<CowFightPage />} />
              <Route path="/milk-hospital" element={<MilkHospitalPage />} />
              <Route path="/airplane" element={<AirplanePage />} />
              
              {/* Non-game pages - lazy loaded */}
              <Suspense fallback={<LoadingFallback />}>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Suspense>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorHandler>
  </ErrorBoundary>
);

export default App;
