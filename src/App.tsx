import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Sparkles, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import ToolDetail from './pages/ToolDetail';
import CategoryView from './pages/CategoryView';
import Compare from './pages/Compare';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Advertise from './pages/Advertise';
import Affiliate from './pages/Affiliate';
import Contact from './pages/Contact';
import About from './pages/About';
import Sitemap from './pages/Sitemap';
import DynamicSitemap from './pages/DynamicSitemap';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { useSSR } from './hooks/useSSR';
import { preloadCriticalResources } from './utils/preloader';
import { trackWebVitals, addResourceHints } from './utils/performance';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const isSSR = useSSR();

  useEffect(() => {
    setIsHydrated(true);
    if (!isSSR) {
      // Client-side only optimizations
      preloadCriticalResources();
      addResourceHints();
      trackWebVitals();
    }
  }, [isSSR]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated && typeof window !== 'undefined') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <Sparkles className="h-10 w-10 text-primary-500" />
              <span className="text-2xl font-bold gradient-text">Aitoonic</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/categories" className="text-slate-300 hover:text-white transition-colors">
                Categories
              </Link>
              <Link to="/ai-agent" className="text-slate-300 hover:text-white transition-colors">
                AI Agents
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 py-4 border-t border-slate-700">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/categories"
                  className="text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/ai-agent"
                  className="text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI Agents
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/ai-agent" element={<Agents />} />
          <Route path="/ai-agent/:slug" element={<AgentDetail />} />
          <Route path="/ai/:slug" element={<ToolDetail />} />
          <Route path="/category/:name" element={<CategoryView />} />
          <Route path="/compare/:tools" element={<Compare />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/api/sitemap/:type.xml" element={<DynamicSitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold gradient-text">Aitoonic</span>
              </div>
              <p className="text-slate-400">
                Discover the future of AI tools and automation
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-slate-400 hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate" className="text-slate-400 hover:text-white transition-colors">
                    Affiliate Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Advertise</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/advertise" className="text-slate-400 hover:text-white transition-colors">
                    Publish Your Tool
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:dc556316@gmail.com"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact for Advertising
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400">
              © 2024 Aitoonic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Wrap App with providers only at the top level
const AppWithProviders: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ScrollToTop />
        <App />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default AppWithProviders;