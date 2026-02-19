// client/src/pages/seller/Subscriptions.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const Subscriptions = () => {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '3 Property Listings',
        'Basic Analytics',
        'Email Support',
        'Standard Photos (5 per listing)',
      ],
      limitations: [
        'No Featured Listings',
        'No Priority Support',
        'Limited to 1 city'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 49, yearly: 470 },
      popular: true,
      features: [
        '15 Property Listings',
        'Advanced Analytics',
        'Priority Email Support',
        'HD Photos (20 per listing)',
        '3 Featured Listings/month',
        'Virtual Tour Support',
        'Lead Management Tools'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 149, yearly: 1430 },
      features: [
        'Unlimited Listings',
        'Premium Analytics & Reports',
        '24/7 Phone & Email Support',
        'Unlimited HD Photos',
        'Unlimited Featured Listings',
        'Virtual Tours & 3D Views',
        'API Access',
        'Dedicated Account Manager',
        'Custom Branding',
        'Team Management'
      ],
      limitations: []
    }
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentPlan(planId);
    toast.success(`Successfully subscribed to ${planId} plan!`);
    setLoading(false);
  };

  return (
    <>
      <SEO title="Subscriptions - HomeScape Seller" description="Choose your subscription plan" />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the perfect plan for your real estate business. All plans include a 14-day free trial.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative w-14 h-7 bg-blue-600 rounded-full p-1"
                >
                  <span
                    className={`absolute w-5 h-5 bg-white rounded-full transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Yearly
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Save 20%
                  </span>
                </span>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
                    plan.popular ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ${billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                      </span>
                      <span className="text-gray-500">/month</span>
                      {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          ${plan.price.yearly} billed annually
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading || currentPlan === plan.id}
                      className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        currentPlan === plan.id
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {currentPlan === plan.id ? '✓ Current Plan' : 'Subscribe'}
                    </button>

                    <div className="mt-8">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="mt-0.5">✗</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Current Subscription */}
            {currentPlan !== 'free' && (
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Subscription</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {plans.find(p => p.id === currentPlan)?.name} Plan
                      </p>
                      <p className="text-sm text-gray-500">Next billing date: February 15, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex gap-4">
                    <button className="text-blue-600 text-sm hover:underline">
                      Update Payment Method
                    </button>
                    <button className="text-red-600 text-sm hover:underline">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'Can I cancel my subscription anytime?',
                    a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
                  },
                  {
                    q: 'What happens to my listings if I downgrade?',
                    a: 'Your existing listings will remain active. However, you won\'t be able to add new listings beyond your new plan\'s limit.'
                  },
                  {
                    q: 'Is there a free trial?',
                    a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
                  },
                  {
                    q: 'Can I upgrade or downgrade at any time?',
                    a: 'Absolutely. You can change your plan at any time, and we\'ll prorate the difference.'
                  }
                ].map((faq, index) => (
                  <details key={index} className="bg-white rounded-xl shadow-sm group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                      <span className="font-medium text-gray-900">{faq.q}</span>
                      <span className="text-blue-600 group-open:rotate-180 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;