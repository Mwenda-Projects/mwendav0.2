import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // 1. Import the Provider
import Index from "./pages/Index";
import About from "./pages/About";
import Categories from "./pages/Categories";
import CategoryPosts from "./pages/CategoryPosts";
import Contact from "./pages/Contact";
import BlogPost from "./pages/BlogPost";
import SearchPage from "./pages/SearchPage";
import Support from "./pages/Support";
import Unsubscribe from "./pages/Unsubscribe";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery"; // Added Gallery import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* 2. Wrap everything in HelmetProvider */}
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:category" element={<CategoryPosts />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/post/:slug" element={<BlogPost />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/gallery" element={<Gallery />} /> {/* Added Gallery Route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;