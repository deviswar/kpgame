// Fresh deployment trigger - v1.0.4 - Rocket fast loading
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

// CRITICAL: Only import WelcomePage eagerly for rocket-fast first paint
// Everything else is lazy-loaded to minimize initial bundle
import WelcomePage from "./pages/WelcomePage";

// Lazy load ALL other routes for faster initial load
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const CowFightPage = lazy(() => import("./pages/CowFightPage"));
const MilkHospitalPage = lazy(() => import("./pages/MilkHospitalPage"));
const AirplanePage = lazy(() => import("./pages/AirplanePage"));

const queryClient = new QueryClient();

// Minimal loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen min-h-[100dvh] game-gradient flex items-center justify-center">
    <div className="text-white text-xl animate-pulse">Loading...</div>
  </div>
);

// Global error handler component
const GlobalErrorHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Catch unhandled promise rejections (prevents crash on mobile audio failures)
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", event.reason);
      event.preventDefault(); // Prevent crash
    };

    // Catch global errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      // Don't prevent default - let ErrorBoundary handle React errors
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
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* ROCKET FAST: Root shows only WelcomePage (tiny bundle) */}
                <Route path="/" element={<WelcomePage />} />
                
                {/* Admin panel - direct access to all screens */}
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/cow-fight" element={<CowFightPage />} />
                <Route path="/milk-hospital" element={<MilkHospitalPage />} />
                <Route path="/airplane" element={<AirplanePage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorHandler>
  </ErrorBoundary>
);

export default App;
