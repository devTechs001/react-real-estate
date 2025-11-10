import SEO from '../components/common/SEO';

const TermsOfService = () => {
  return (
    <>
      <SEO title="Terms of Service" description="Terms and conditions for using our platform" />
      
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: January 1, 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using this platform, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to these terms, please do not
                use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily access our services for personal,
                non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate and complete
                information. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Maintaining the security of your account</li>
                <li>All activities that occur under your account</li>
                <li>Immediately notifying us of unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Property Listings</h2>
              <p className="text-gray-700 mb-4">When listing properties, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Have the legal right to list the property</li>
                <li>Not engage in fraudulent activities</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not discriminate based on protected characteristics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">You may not:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful code or malware</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to gain unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Content Ownership</h2>
              <p className="text-gray-700">
                You retain ownership of content you submit. However, by posting content, you grant
                us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display
                your content in connection with our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Payment Terms</h2>
              <p className="text-gray-700">
                If you purchase a subscription or paid service, you agree to pay all fees and
                charges. All payments are non-refundable unless otherwise stated. We reserve the
                right to change our pricing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Disclaimer</h2>
              <p className="text-gray-700">
                The materials on our platform are provided on an 'as is' basis. We make no
                warranties, expressed or implied, and hereby disclaim all other warranties including,
                without limitation, implied warranties of merchantability, fitness for a particular
                purpose, or non-infringement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Limitations</h2>
              <p className="text-gray-700">
                In no event shall Real Estate Platform or its suppliers be liable for any damages
                arising out of the use or inability to use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your account and access to our services immediately,
                without prior notice, for any reason, including breach of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
              <p className="text-gray-700">
                These terms shall be governed by and construed in accordance with the laws of the
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-gray-700">
                Questions about the Terms of Service should be sent to us at:
                <br />
                Email: legal@realestate.com
                <br />
                Address: 123 Real Estate St, New York, NY 10001
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;