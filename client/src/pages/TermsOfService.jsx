// client/src/pages/TermsOfService.jsx
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import '../styles/TermsOfService.css';

const TermsOfService = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using HomeScape ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all users, including buyers, sellers, agents, and visitors.`
    },
    {
      title: '2. Description of Services',
      content: `HomeScape provides an online real estate platform that allows users to:
      
• Browse and search for properties for sale or rent
• List properties for sale or rent
• Connect with property owners, buyers, and agents
• Access AI-powered property recommendations
• Schedule property viewings
• Receive market insights and analytics

We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.`
    },
    {
      title: '3. User Accounts',
      content: `To access certain features, you must create an account. You agree to:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized access
• Be responsible for all activities under your account

We reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: '4. Property Listings',
      content: `When listing a property, you agree that:

• You have the legal right to list the property
• All information provided is accurate and not misleading
• Images and descriptions represent the actual property
• Pricing information is current and accurate
• You will respond promptly to inquiries

We reserve the right to remove listings that violate these guidelines.`
    },
    {
      title: '5. User Conduct',
      content: `You agree not to:

• Use the platform for any illegal purpose
• Post false, misleading, or fraudulent information
• Harass, threaten, or intimidate other users
• Attempt to gain unauthorized access to our systems
• Use automated tools to scrape or collect data
• Interfere with the proper functioning of the platform
• Violate any applicable laws or regulations`
    },
    {
      title: '6. Fees and Payments',
      content: `Certain services may require payment:

• Subscription fees for premium listings
• Transaction fees for completed sales
• Advertising and promotion fees

All fees are clearly disclosed before purchase. Payments are processed securely through our payment partners. Refund policies vary by service type.`
    },
    {
      title: '7. Intellectual Property',
      content: `All content on HomeScape, including but not limited to text, graphics, logos, images, and software, is the property of HomeScape or its licensors and is protected by copyright and other intellectual property laws.

You may not reproduce, distribute, or create derivative works without our express written permission.`
    },
    {
      title: '8. Privacy',
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.`
    },
    {
      title: '9. Disclaimers',
      content: `THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:

• The accuracy of property listings
• The availability of any property
• The outcome of any transaction
• Uninterrupted or error-free service

We are not responsible for the actions of third parties, including other users.`
    },
    {
      title: '10. Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOMESCAPE SHALL NOT BE LIABLE FOR:

• Any indirect, incidental, or consequential damages
• Loss of profits, data, or business opportunities
• Damages arising from your use of the platform
• Actions or omissions of third parties

Our total liability shall not exceed the amount you paid us in the past 12 months.`
    },
    {
      title: '11. Indemnification',
      content: `You agree to indemnify and hold harmless HomeScape, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:

• Your use of the platform
• Your violation of these terms
• Your violation of any rights of third parties`
    },
    {
      title: '12. Dispute Resolution',
      content: `Any disputes arising from these terms or your use of the platform shall be resolved through:

1. Informal negotiation
2. Mediation
3. Binding arbitration in accordance with the rules of the American Arbitration Association

Class action lawsuits are waived to the extent permitted by law.`
    },
    {
      title: '13. Changes to Terms',
      content: `We may update these terms from time to time. We will notify you of material changes by:

• Posting notice on our website
• Sending email notification
• In-app notifications

Continued use of the platform after changes constitutes acceptance of the new terms.`
    },
    {
      title: '14. Contact Information',
      content: `If you have questions about these Terms of Service, please contact us:

Email: legal@homescape.com
Address: 123 Property Lane, Miami, FL 33101
Phone: +1 (555) 123-4567`
    }
  ];

  return (
    <>
      <SEO title="Terms of Service - HomeScape" description="Read our terms of service" />

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-blue-200">Last updated: {lastUpdated}</p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Quick Navigation */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {sections.map((section, index) => (
                    <a
                      key={index}
                      href={`#section-${index}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    id={`section-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                    <div className="text-gray-600 whitespace-pre-line">{section.content}</div>
                  </motion.div>
                ))}
              </div>

              {/* Agreement */}
              <div className="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
                <p className="text-gray-700">
                  By using HomeScape, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default TermsOfService;