import { useState, useEffect } from 'react';
import { FaCrown, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Subscriptions = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data } = await api.get('/seller/subscription');
      setCurrentPlan(data);
    } catch (error) {
      toast.error('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      const { data } = await api.post('/seller/subscription/subscribe', { planId });
      setCurrentPlan(data);
      toast.success('Subscription updated successfully');
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      await api.post('/seller/subscription/cancel');
      setCurrentPlan(null);
      toast.success('Subscription cancelled');
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: 'Free',
      features: [
        { text: 'Up to 5 property listings', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'Featured listings', included: false },
        { text: 'Priority support', included: false },
        { text: 'Advanced analytics', included: false },
      ],
      color: 'gray',
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29,
      period: 'month',
      features: [
        { text: 'Up to 25 property listings', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority email support', included: true },
        { text: '5 featured listings/month', included: true },
        { text: 'Custom branding', included: true },
        { text: 'API access', included: false },
      ],
      color: 'blue',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      features: [
        { text: 'Unlimited property listings', included: true },
        { text: 'Advanced analytics & reports', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Unlimited featured listings', included: true },
        { text: 'Custom branding', included: true },
        { text: 'API access', included: true },
      ],
      color: 'purple',
    },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="Subscriptions" description="Choose your subscription plan" />

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaCrown className="inline mr-3" />
            Subscription Plans
          </h1>
          <p className="text-xl">Choose the plan that fits your business needs</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Current Plan */}
        {currentPlan && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Current Plan</p>
                <p className="text-2xl font-bold">{currentPlan.name}</p>
                <p className="text-gray-600">
                  {currentPlan.price > 0
                    ? `$${currentPlan.price}/${currentPlan.period}`
                    : 'Free'}
                </p>
              </div>
              {currentPlan.id !== 'basic' && (
                <button
                  onClick={handleCancelSubscription}
                  className="btn btn-danger"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                  {plan.price === 0 && (
                    <span className="text-gray-600 ml-2">Forever</span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <FaTimes className="text-gray-300 mt-1 flex-shrink-0" />
                      )}
                      <span
                        className={feature.included ? 'text-gray-700' : 'text-gray-400'}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={currentPlan?.id === plan.id}
                  className={`btn w-full ${
                    currentPlan?.id === plan.id
                      ? 'btn-outline cursor-not-allowed'
                      : plan.popular
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {currentPlan?.id === plan.id ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Can I change my plan anytime?</p>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be
                reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">What happens if I cancel?</p>
              <p className="text-gray-600">
                You'll continue to have access to your current plan until the end of your
                billing period. After that, you'll be moved to the free Basic plan.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Do you offer refunds?</p>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. Contact support
                for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
