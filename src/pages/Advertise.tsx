import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, DollarSign, FileText, Link as LinkIcon } from 'lucide-react';

function Advertise() {
  return (
    <div className="min-h-screen bg-royal-dark py-20">
      <Helmet>
        <title>Advertise With Us | Aitoonic.com</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Advertise With Us</h1>
          
          <div className="prose prose-invert prose-lg">
            <p className="lead">
              Get your AI tools and services in front of our engaged audience of tech enthusiasts and 
              professionals.
            </p>

            <div className="bg-royal-dark-card rounded-xl p-8 my-8 border border-royal-dark-lighter">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <DollarSign className="w-6 h-6 text-royal-gold mr-2" />
                Pricing
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-royal-gold font-bold text-xl mr-2">$99</span>
                  <span>per tool listing or guest post</span>
                </div>
                <p className="text-gray-400">
                  This includes placement in our directory, social media promotion, and analytics reporting.
                </p>
              </div>
            </div>

            <h2>What We Offer</h2>
            <ul>
              <li>Tool listings in our directory</li>
              <li>Guest post opportunities</li>
              <li>Link exchange partnerships</li>
              <li>Featured placement opportunities</li>
            </ul>

            <div className="bg-royal-dark-card rounded-xl p-8 my-8 border border-royal-dark-lighter">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Mail className="w-6 h-6 text-royal-gold mr-2" />
                Contact Us
              </h2>
              <p>
                For advertising inquiries, please email:{' '}
                <a href="mailto:dc556316@gmail.com" className="text-royal-gold hover:text-royal-gold/80">
                  dc556316@gmail.com
                </a>
              </p>
            </div>

            <h2>Guidelines</h2>
            <ul>
              <li>All submitted content must be original and relevant to AI tools</li>
              <li>We reserve the right to reject any submission that doesn't meet our quality standards</li>
              <li>Payment must be received before publication</li>
              <li>All listings and posts will be clearly marked as sponsored content where applicable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advertise;