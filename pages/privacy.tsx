import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy | Aitoonic</title>
        <meta name="description" content="Privacy policy for Aitoonic - how we collect, use, and protect your personal information." />
        <meta property="og:title" content="Privacy Policy | Aitoonic" />
        <meta property="og:description" content="Privacy policy for Aitoonic - how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <div className="min-h-screen bg-royal-dark py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
            
            <div className="prose prose-invert prose-lg">
              <p>Last updated: July 25, 2024</p>
              
              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, information we obtain automatically 
                when you visit our website, and information from other sources.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to operate our business and provide you with our services, 
                to communicate with you, to improve our services, and to comply with our legal obligations.
              </p>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with third-party 
                service providers who assist us in operating our website and conducting our business.
              </p>

              <h2>4. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and to 
                maintain certain information to improve your experience.
              </p>

              <h2>5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can also 
                object to or restrict certain processing of your information.
              </p>

              <h2>6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>

              <h2>7. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new privacy policy on this page.
              </p>
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