import Referral from '../models/Referral.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { nanoid } from 'nanoid';

// Generate unique referral code
export const generateReferralCode = () => nanoid(10);

// Create shareable link for property
export const createPropertyLink = async (req, res) => {
  try {
    const { propertyId, expiresInDays = 90 } = req.body;
    const userId = req.user._id;

    // Verify property belongs to user or user is admin
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const referral = await Referral.create({
      referrerType: 'property',
      referrerId: userId,
      propertyId: propertyId,
      uniqueCode: generateReferralCode(),
      expiresAt,
    });

    const shareUrl = `${process.env.CLIENT_URL}/invite/${referral.uniqueCode}`;

    res.json({
      referral,
      shareUrl,
      message: 'Shareable link created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create seller profile link
export const createSellerLink = async (req, res) => {
  try {
    const userId = req.user._id;
    const { expiresInDays = 365 } = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const referral = await Referral.create({
      referrerType: 'seller',
      referrerId: userId,
      uniqueCode: generateReferralCode(),
      expiresAt,
    });

    const shareUrl = `${process.env.CLIENT_URL}/invite/${referral.uniqueCode}`;

    res.json({
      referral,
      shareUrl,
      message: 'Seller profile link created',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get referral by code
export const getReferralByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const referral = await Referral.findOne({
      uniqueCode: code,
      isActive: true,
    })
      .populate('referrerId', 'name avatar company')
      .populate('propertyId');

    if (!referral) {
      return res.status(404).json({ message: 'Referral link not found or expired' });
    }

    // Check if expired
    if (referral.expiresAt && new Date() > referral.expiresAt) {
      referral.isActive = false;
      await referral.save();
      return res.status(410).json({ message: 'Link has expired' });
    }

    // Increment clicks
    referral.clicks += 1;
    if (req.user) {
      referral.clickedBy.push({
        userId: req.user._id,
        timestamp: new Date(),
      });
    }
    await referral.save();

    // Return appropriate data based on referral type
    if (referral.referrerType === 'property') {
      return res.json({
        type: 'property',
        property: referral.propertyId,
        seller: referral.referrerId,
      });
    } else if (referral.referrerType === 'seller') {
      return res.json({
        type: 'seller',
        seller: referral.referrerId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my referral links
export const getMyReferrals = async (req, res) => {
  try {
    const userId = req.user._id;

    const referrals = await Referral.find({ referrerId: userId })
      .populate('propertyId', 'title price images')
      .sort('-createdAt');

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update referral
export const updateReferral = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, expiresInDays } = req.body;

    const referral = await Referral.findById(id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    if (referral.referrerId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (isActive !== undefined) referral.isActive = isActive;
    if (expiresInDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      referral.expiresAt = expiresAt;
    }

    await referral.save();

    res.json({
      referral,
      message: 'Referral updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete referral
export const deleteReferral = async (req, res) => {
  try {
    const { id } = req.params;

    const referral = await Referral.findById(id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    if (referral.referrerId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Referral.findByIdAndDelete(id);

    res.json({ message: 'Referral deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get referral analytics
export const getReferralAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const referrals = await Referral.find({ referrerId: userId });

    const totalClicks = referrals.reduce((sum, r) => sum + r.clicks, 0);
    const totalConversions = referrals.reduce((sum, r) => sum + r.conversions, 0);
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;

    res.json({
      totalReferrals: referrals.length,
      totalClicks,
      totalConversions,
      conversionRate: `${conversionRate}%`,
      referrals: referrals.map((r) => ({
        id: r._id,
        code: r.uniqueCode,
        type: r.referrerType,
        clicks: r.clicks,
        conversions: r.conversions,
        createdAt: r.createdAt,
        expiresAt: r.expiresAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
