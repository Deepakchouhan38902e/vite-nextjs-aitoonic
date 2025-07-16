import { GetStaticProps } from 'next';
import Head from 'next/head';
import { User, Mail, Linkedin } from 'lucide-react';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About Us | Aitoonic</title>
        <meta name="description" content="Learn about Aitoonic - your trusted resource for discovering and comparing the latest AI tools and technologies." />
        <meta property="og:title" content="About Us | Aitoonic" />
        <meta property="og:description" content="Learn about Aitoonic - your trusted resource for discovering and comparing the latest AI tools and technologies." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">About Us</h1>
            
            <div className="bg-royal-dark-card rounded-xl p-8 border border-royal-dark-lighter mb-12">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-royal-dark flex items-center justify-center">
                  <User className="w-12 h-12 text-royal-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Deepak Chouhan</h2>
                  <p className="text-gray-400">
                    Digital Marketing & SEO Expert with 7 years of experience
                  </p>
                </div>
              </div>

              <div className="prose prose-invert prose-lg">
                <p>
                  With over 7 years of experience in digital marketing and SEO, I've helped numerous 
                  businesses improve their online presence and achieve their marketing goals.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-8">
                  <a
                    href="mailto:dc556316@gmail.com"
                    className="flex items-center space-x-2 text-royal-gold hover:text-royal-gold/80 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>dc556316@gmail.com</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/deepakchauhan333/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-royal-gold hover:text-royal-gold/80 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-lg">
              <h2>Our Mission</h2>
              <p>
                Aitoonic aims to be your trusted resource for discovering and comparing the latest AI 
                tools and technologies. We're committed to providing accurate, unbiased information to help 
                you make informed decisions about AI solutions for your needs.
              </p>

              <h2>What We Offer</h2>
              <ul>
                <li>Comprehensive AI tool reviews and comparisons</li>
                <li>Up-to-date information on the latest AI technologies</li>
                <li>Expert insights and recommendations</li>
                <li>Community-driven ratings and feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 86400 // Revalidate once per day
  };
};