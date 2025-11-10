import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';
import {
  stripe,
  subscriptionPlans,
  createSubscription,
  cancelSubscription as cancelStripeSubscription,
} from '../config/payment.js';

// @desc    Create subscription
// @route   POST /api/payments/create-subscription
// @access  Private
export const createUserSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!subscriptionPlans[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // Check if user already has active subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'You already have an active subscription' });
    }

    // Create or get Stripe customer
    let customer;
    if (req.user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
      });
      req.user.stripeCustomerId = customer.id;
      await req.user.save();
    }

    // Create Stripe subscription
    const planDetails = subscriptionPlans[plan];
    const stripeSubscription = await createSubscription(customer.id, planDetails.priceId);

    // Create subscription in database
    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      status: 'active',
      price: planDetails.price,
      billingCycle: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: customer.id,
      features: planDetails.features,
    });

    res.status(201).json({
      subscription,
      clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Subscription Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/payments/cancel-subscription
// @access  Private
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    // Cancel in Stripe
    await cancelStripeSubscription(subscription.stripeSubscriptionId);

    // Update in database
    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    res.json({ message: 'Subscription cancelled successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user subscription
// @route   GET /api/payments/subscription
// @access  Private
export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Webhook handler
// @route   POST /api/payments/webhook
// @access  Public
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await Payment.create({
        user: paymentIntent.metadata.userId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'succeeded',
        stripePaymentIntentId: paymentIntent.id,
      });
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await Payment.create({
        user: failedPayment.metadata.userId,
        amount: failedPayment.amount / 100,
        currency: failedPayment.currency,
        status: 'failed',
        stripePaymentIntentId: failedPayment.id,
      });
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { status: 'cancelled' }
      );
      break;
  }

  res.json({ received: true });
};