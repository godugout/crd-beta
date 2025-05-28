
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { CardProvider } from "@/context/CardContext";
import { BrandThemeProvider } from "@/context/BrandThemeContext";
import DevAuthStatus from "@/components/dev/DevAuthStatus";
import PageLayout from "@/components/navigation/PageLayout";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import CardDetail from "@/pages/CardDetail";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Labs from "@/pages/Labs";
import CardCreator from "@/components/card-creation/CardCreator";
import UnifiedCardEditor from "@/pages/UnifiedCardEditor";
import OaklandMemories from "@/pages/OaklandMemories";
import OaklandMemoryCreator from "@/components/oakland/OaklandMemoryCreator";
import CardShowcase from "@/pages/CardShowcase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CardProvider>
        <BrandThemeProvider>
          <TooltipProvider>
            <Toaster />
            <DevAuthStatus />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PageLayout><Home /></PageLayout>} />
                <Route path="/gallery" element={<PageLayout><Gallery /></PageLayout>} />
                <Route path="/cards/:id" element={<PageLayout><CardDetail /></PageLayout>} />
                <Route path="/cards/create" element={<UnifiedCardEditor />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
                <Route path="/dashboard" element={<PageLayout><Dashboard /></PageLayout>} />
                <Route path="/labs" element={<PageLayout><Labs /></PageLayout>} />
                
                {/* Oakland A's Memory Cards */}
                <Route path="/oakland-memories" element={<PageLayout><OaklandMemories /></PageLayout>} />
                <Route path="/oakland-memories/create" element={<PageLayout><OaklandMemoryCreator /></PageLayout>} />
                
                {/* Card Creator (Old) */}
                <Route path="/card-creator" element={<PageLayout><CardCreator /></PageLayout>} />
                
                {/* Card Showcase */}
                <Route path="/showcase/:id" element={<CardShowcase />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BrandThemeProvider>
      </CardProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
