import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Search, AlertCircle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-royal-dark flex items-center justify-center py-20">
      <Helmet>
        <title>Page Not Found | Aitoonic.com</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-royal-dark-lighter flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-royal-gold" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Page Not Found
          </h1>
          
          <p className="text-xl text-gray-300 mb-12">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-royal-gold text-royal-dark px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border-2 border-royal-gold text-royal-gold px-8 py-3 rounded-lg font-bold hover:bg-royal-gold hover:text-royal-dark transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Browse Tools</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;