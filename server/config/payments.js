import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const subscriptionPlans = {
  basic: {
    name: 'Basic',
    price: 9.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: {
      maxListings: 5,
      featuredListings: 0,
      analytics: false,
      prioritySupport: false,
      aiFeatures: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      maxListings: 25,
      featuredListings: 3,
      analytics: true,
      prioritySupport: false,
      aiFeatures: true,
    },
  },
  premium: {
    name: 'Premium',
    price: 99.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: {
      maxListings: -1, // unlimited
      featuredListings: 10,
      analytics: true,
      prioritySupport: true,
      aiFeatures: true,
    },
  },
};

export const createPaymentIntent = async (amount, currency = 'usd') => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
  });
};

export const createSubscription = async (customerId, priceId) => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
};

export const cancelSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};