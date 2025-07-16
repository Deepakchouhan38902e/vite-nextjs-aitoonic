import { ReactNode } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Sparkles className="h-10 w-10 text-primary-500" />
              <span className="text-2xl font-bold gradient-text">Aitoonic</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/categories" className="text-slate-300 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/ai-agent" className="text-slate-300 hover:text-white transition-colors">
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
                  href="/"
                  className="text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/categories"
                  className="text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/ai-agent"
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
        {children}
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
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-slate-400 hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="text-slate-400 hover:text-white transition-colors">
                    Affiliate Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Advertise</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/advertise" className="text-slate-400 hover:text-white transition-colors">
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
}