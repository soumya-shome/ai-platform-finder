
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Directory from "./pages/Directory";
import PlatformPage from "./pages/PlatformPage";
import ComparePlatforms from "./pages/ComparePlatforms";
import SubmitPlatform from "./pages/SubmitPlatform";
import EditPlatform from "./pages/EditPlatform";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Sitemap from "./pages/Sitemap";
import { AdminProvider } from "./contexts/AdminContext";
import { CompareProvider } from "./components/PlatformCompare";
import { Analytics } from "@vercel/analytics/react"
// import DatabaseInitializer from "./components/DatabaseInitializer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Analytics/>
        <Sonner />
        <BrowserRouter>
          <AdminProvider>
            <CompareProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/platform/:id" element={<PlatformPage />} />
                <Route path="/compare" element={<ComparePlatforms />} />
                <Route path="/submit" element={<SubmitPlatform />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/edit-platform/:id" element={<EditPlatform />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/sitemap-html" element={<Sitemap />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* <DatabaseInitializer /> */}
            </CompareProvider>
          </AdminProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
