// client/src/pages/PrivacyPolicy.jsx
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly:

**Personal Information:**
• Name, email address, phone number
• Profile photo and biographical information
• Payment and billing information
• Property preferences and search history

**Automatically Collected:**
• Device information and IP address
• Browser type and operating system
• Usage patterns and interactions
• Location data (with your permission)
• Cookies and similar technologies`
    },
    {
      title: 'How We Use Your Information',
      content: `We use your information to:

• Provide and improve our services
• Process transactions and send notifications
• Personalize your experience with AI recommendations
• Communicate about properties and updates
• Analyze usage patterns and trends
• Prevent fraud and ensure security
• Comply with legal obligations`
    },
    {
      title: 'Information Sharing',
      content: `We may share your information with:

**Service Providers:** Third parties who help us operate our platform
**Property Owners/Agents:** When you express interest in a property
**Legal Requirements:** When required by law or to protect rights
**Business Transfers:** In connection with mergers or acquisitions

We do NOT sell your personal information to third parties.`
    },
    {
      title: 'Data Security',
      content: `We implement robust security measures:

• Encryption of data in transit and at rest
• Regular security audits and penetration testing
• Access controls and authentication
• Secure data centers
• Employee training on data protection

No system is 100% secure, but we strive to protect your information.`
    },
    {
      title: 'Your Rights',
      content: `Depending on your location, you may have the right to:

• Access your personal information
• Correct inaccurate data
• Delete your account and data
• Export your data
• Opt-out of marketing communications
• Restrict processing of your data
• Object to automated decision-making

Contact us to exercise these rights.`
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies for:

• Authentication and security
• Remembering preferences
• Analytics and performance
• Personalized advertising

You can manage cookies through your browser settings. Note that disabling cookies may affect functionality.`
    },
    {
      title: 'Third-Party Links',
      content: `Our platform may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites you visit.`
    },
    {
      title: 'Children\'s Privacy',
      content: `Our services are not directed to children under 18. We do not knowingly collect information from children. If we learn we have collected such information, we will delete it promptly.`
    },
    {
      title: 'International Transfers',
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses.`
    },
    {
      title: 'Data Retention',
      content: `We retain your information for as long as:

• Your account is active
• Needed to provide services
• Required by legal obligations
• Necessary for legitimate business purposes

You can request deletion of your account at any time.`
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this policy periodically. We will notify you of significant changes through:

• Email notification
• In-app notifications
• Website announcements

Your continued use after changes indicates acceptance of the updated policy.`
    },
    {
      title: 'Contact Us',
      content: `For privacy-related inquiries:

**Email:** privacy@homescape.com
**Address:** Privacy Team, 123 Property Lane, Miami, FL 33101
**Phone:** +1 (555) 123-4567

For EU residents, you may also contact your local data protection authority.`
    }
  ];

  return (
    <>
      <SEO title="Privacy Policy - HomeScape" description="Learn how we protect your privacy" />

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-purple-900 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-purple-200">Last updated: {lastUpdated}</p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                <h2 className="font-semibold text-gray-900 mb-3">Privacy at a Glance</h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>We never sell your data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Your data is encrypted</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>You control your information</span>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                    <div className="text-gray-600 whitespace-pre-line prose prose-sm max-w-none">
                      {section.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default PrivacyPolicy;