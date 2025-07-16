import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageCircle } from 'lucide-react';

function Contact() {
  return (
    <div className="min-h-screen bg-royal-dark py-20">
      <Helmet>
        <title>Contact Us | Aitoonic.com</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter">
              <Mail className="w-8 h-8 text-royal-gold mb-4" />
              <h2 className="text-2xl font-bold mb-4">Email Us</h2>
              <p className="text-gray-400 mb-4">
                For general inquiries, advertising opportunities, or partnership proposals.
              </p>
              <a 
                href="mailto:dc556316@gmail.com"
                className="text-royal-gold hover:text-royal-gold/80 font-medium"
              >
                dc556316@gmail.com
              </a>
            </div>

            <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter">
              <MessageCircle className="w-8 h-8 text-royal-gold mb-4" />
              <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
              <p className="text-gray-400 mb-4">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>

          <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-royal-dark border border-royal-dark-lighter rounded-lg text-white focus:outline-none focus:border-royal-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-royal-dark border border-royal-dark-lighter rounded-lg text-white focus:outline-none focus:border-royal-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-royal-dark border border-royal-dark-lighter rounded-lg text-white focus:outline-none focus:border-royal-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 bg-royal-dark border border-royal-dark-lighter rounded-lg text-white focus:outline-none focus:border-royal-gold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-royal-gold text-royal-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;