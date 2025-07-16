import React from 'react';
import { Helmet } from 'react-helmet-async';

function Terms() {
  return (
    <div className="min-h-screen bg-royal-dark py-20">
      <Helmet>
        <title>Terms & Conditions | Aitoonic.com</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Terms & Conditions</h1>
          
          <div className="prose prose-invert prose-lg">
            <p>Last updated: July 25, 2024</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Aitoonic, you accept and agree to be bound by the terms and 
              provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials (information or software) on 
              Aitoonic for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
              The materials on Aitoonic are provided on an 'as is' basis. Aitoonic makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other 
              violation of rights.
            </p>

            <h2>4. Limitations</h2>
            <p>
              In no event shall Aitoonic or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Aitoonic.
            </p>

            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on Aitoonic could include technical, typographical, or 
              photographic errors. Aitoonic does not warrant that any of the materials on its 
              website are accurate, complete, or current.
            </p>

            <h2>6. Links</h2>
            <p>
              Aitoonic has not reviewed all of the sites linked to its website and is not 
              responsible for the contents of any such linked site. The inclusion of any link does not 
              imply endorsement by Aitoonic of the site.
            </p>

            <h2>7. Modifications</h2>
            <p>
              Aitoonic may revise these terms of service at any time without notice. By using this 
              website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;