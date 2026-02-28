import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import HeroPage from "./pages/HeroPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import ModeSelectPage from "./pages/ModeSelectPage";
import RouteSetupPage from "./pages/RouteSetupPage";
import RoutePreviewPage from "./pages/RoutePreviewPage";
import ActiveNavPage from "./pages/ActiveNavPage";
import ExplorePage from "./pages/ExplorePage";
import VaultPage from "./pages/VaultPage";
import ChallengesPage from "./pages/ChallengesPage";
import ProfilePage from "./pages/ProfilePage";
import StopDetailPage from "./pages/StopDetailPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import BadgesPage from "./pages/BadgesPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { hasSeenHero } = useApp();

  return (
    <Routes>
      <Route path="/" element={hasSeenHero ? <Navigate to="/home" /> : <HeroPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/mode-select" element={<ModeSelectPage />} />
      <Route path="/route-setup" element={<RouteSetupPage />} />
      <Route path="/route-preview" element={<RoutePreviewPage />} />
      <Route path="/active-nav" element={<ActiveNavPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/vault" element={<VaultPage />} />
      <Route path="/challenges" element={<ChallengesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/stop/:id" element={<StopDetailPage />} />
      <Route path="/challenge/:id" element={<ChallengeDetailPage />} />
      <Route path="/badges" element={<BadgesPage />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen relative">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
