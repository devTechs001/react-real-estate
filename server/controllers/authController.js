import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { USER_ROLES } from '../config/constants.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Validate role if provided
    const userRole = role && Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.USER;

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: userRole,
      isVerified: process.env.NODE_ENV === 'development', // Auto-verify in development
    });

    if (user) {
      // Generate email verification token (only in production)
      if (process.env.NODE_ENV !== 'development') {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = crypto
          .createHash('sha256')
          .update(verificationToken)
          .digest('hex');
        await user.save();

        // TODO: Send verification email here
        // const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        // await sendEmail({
        //   email: user.email,
        //   subject: 'Email Verification',
        //   template: 'verifyEmail',
        //   data: { verificationUrl, name: user.name }
        // });
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: process.env.NODE_ENV === 'development'
          ? 'Account created successfully'
          : 'Account created! Please check your email to verify your account',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Check user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if user is verified (skip in development)
    if (process.env.NODE_ENV !== 'development' && !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a JWT setup, logout is typically handled client-side by removing the token
    // However, you could implement token blacklisting here if needed
    
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Update allowed fields only
    const allowedUpdates = ['name', 'phone', 'avatar', 'bio', 'location'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Email update requires verification
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ 
        email: req.body.email.toLowerCase(),
        _id: { $ne: user._id }
      });
      
      if (emailExists) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use' 
        });
      }
      
      updates.email = req.body.email.toLowerCase();
      updates.isVerified = false; // Require re-verification
      
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      updates.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
        
      // TODO: Send verification email
    }

    // Apply updates
    Object.assign(user, updates);
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating profile' 
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide current and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 6 characters' 
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.json({ 
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating password' 
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email address' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      // TODO: Send reset email here
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Password Reset Request',
      //   template: 'resetPassword',
      //   data: { resetUrl, name: user.name }
      // });

      res.json({ 
        success: true,
        message: 'Password reset link sent to your email',
        // For development only - remove in production
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ 
        success: false,
        message: 'Email could not be sent' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a new password' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
    }

    // Hash the token from URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate token for automatic login
    const token = generateToken(user._id);

    res.json({ 
      success: true,
      message: 'Password reset successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while resetting password' 
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email/:verificationToken
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    // Hash the token from URL
    const verificationToken = crypto
      .createHash('sha256')
      .update(req.params.verificationToken)
      .digest('hex');

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid verification token' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already verified' 
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Generate token for automatic login
    const token = generateToken(user._id);

    res.json({ 
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during email verification' 
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email address' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ 
        success: true,
        message: 'If an unverified account exists with this email, a verification link has been sent' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already verified' 
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    user.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    try {
      // TODO: Send verification email here
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Email Verification',
      //   template: 'verifyEmail',
      //   data: { verificationUrl, name: user.name }
      // });

      res.json({ 
        success: true,
        message: 'Verification email sent',
        // For development only - remove in production
        ...(process.env.NODE_ENV === 'development' && { verificationToken })
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return res.status(500).json({ 
        success: false,
        message: 'Email could not be sent' 
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get all available roles
// @route   GET /api/auth/roles
// @access  Private/Admin
export const getAllRoles = async (req, res) => {
  try {
    const roles = Object.entries(USER_ROLES).map(([key, value]) => ({
      id: key,
      name: key.charAt(0) + key.slice(1).toLowerCase(),
      value: value,
      description: getRoleDescription(value)
    }));

    res.json({ 
      success: true,
      roles 
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get permissions for a specific role
// @route   GET /api/auth/roles/:role/permissions
// @access  Private/Admin
export const getRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;

    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role' 
      });
    }

    // Define permissions for each role
    const rolePermissions = {
      admin: [
        'manage_users',
        'manage_properties',
        'manage_inquiries',
        'manage_appointments',
        'view_analytics',
        'manage_system_settings'
      ],
      agent: [
        'create_property',
        'edit_own_property',
        'delete_own_property',
        'view_inquiries',
        'manage_appointments',
        'view_analytics'
      ],
      user: [
        'view_properties',
        'create_inquiry',
        'book_appointment',
        'favorite_properties',
        'view_own_profile'
      ]
    };

    const permissions = rolePermissions[role] || [];

    res.json({
      success: true,
      role,
      permissions
    });
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update user role
// @route   PUT /api/auth/users/:userId/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role provided' 
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot change your own role' 
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated from ${oldRole} to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating user role' 
    });
  }
};

// Helper function to get role description
function getRoleDescription(role) {
  const descriptions = {
    admin: 'Full system access with all permissions',
    agent: 'Can manage properties and interact with clients',
    user: 'Can browse properties and make inquiries'
  };
  return descriptions[role] || 'No description available';
}