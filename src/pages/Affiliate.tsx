import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Info } from 'lucide-react';

function Affiliate() {
  return (
    <div className="min-h-screen bg-royal-dark py-20">
      <Helmet>
        <title>Affiliate Disclaimer | Aitoonic.com</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Affiliate Disclaimer</h1>
          
          <div className="prose prose-invert prose-lg">
            <div className="bg-royal-dark-card rounded-xl p-8 my-8 border border-royal-dark-lighter">
              <div className="flex items-start space-x-4">
                <Info className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                <p className="text-gray-300">
                  This website contains affiliate links. This means if you click on certain links and 
                  make a purchase, I may earn a small commission at no additional cost to you. This 
                  helps support the website and allows me to continue to create free content.
                </p>
              </div>
            </div>

            <h2>What Are Affiliate Links?</h2>
            <p>
              Affiliate links are special URLs that contain my affiliate ID or referral code. When you 
              click on these links and make a purchase, the merchant can track that the sale came from 
              my referral and pay me a small commission.
            </p>

            <h2>Disclosure</h2>
            <p>
              I only recommend products and services that I believe will add value to my readers. All 
              opinions expressed are my own and are not influenced by affiliate partnerships. I disclose 
              all affiliate relationships in accordance with the FTC guidelines.
            </p>

            <h2>How Affiliate Links Are Used</h2>
            <ul>
              <li>Product reviews and recommendations may contain affiliate links</li>
              <li>Tool listings may include affiliate links to the provider's website</li>
              <li>Comparison pages may contain affiliate links to multiple providers</li>
            </ul>

            <h2>Your Privacy</h2>
            <p>
              Clicking on affiliate links does not affect your privacy or the price you pay for products 
              or services. Your personal information is handled according to our Privacy Policy.
            </p>

            <h2>Questions?</h2>
            <p>
              If you have any questions about our affiliate relationships or how we use affiliate links, 
              please contact us at{' '}
              <a href="mailto:dc556316@gmail.com" className="text-royal-gold hover:text-royal-gold/80">
                dc556316@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Affiliate;