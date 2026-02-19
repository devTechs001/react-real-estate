// client/src/pages/Register.jsx
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/Register.css';

// Constants
const ROLES = [
  { value: 'buyer', label: 'Buy/Rent', icon: '🏠', description: 'Find your perfect home' },
  { value: 'seller', label: 'Sell/List', icon: '💰', description: 'List your property' },
];

const FEATURES = [
  { icon: '🔍', text: 'AI-Powered Property Matching' },
  { icon: '💬', text: 'Direct Chat with Owners' },
  { icon: '📊', text: 'Market Insights & Analytics' },
  { icon: '🔔', text: 'Instant Notifications' },
];

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[a-z]/, label: 'One lowercase letter' },
  { regex: /[A-Z]/, label: 'One uppercase letter' },
  { regex: /\d/, label: 'One number' },
  { regex: /[^a-zA-Z\d]/, label: 'One special character' },
];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Prevent memory leaks
  const isMounted = useRef(true);
  const firstNameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Focus management for steps
  useEffect(() => {
    if (step === 1 && firstNameRef.current) {
      firstNameRef.current.focus();
    } else if (step === 2 && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [step]);

  const from = location.state?.from?.pathname || '/dashboard';

  // Generic change handler
  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);

  // Handle blur for validation feedback
  const handleBlur = useCallback((field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Phone number formatting
  const handlePhoneChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 3) {
        value = `(${value}`;
      } else if (value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      }
    }
    
    setFormData(prev => ({ ...prev, phone: value }));
  }, []);

  // Validation functions
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateStep1 = useCallback(() => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Optional phone validation
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.firstName, formData.lastName, formData.email, formData.phone, validateEmail]);

  const validateStep2 = useCallback(() => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const hasMinLength = formData.password.length >= 8;
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      
      if (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber) {
        newErrors.password = 'Password does not meet requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.password, formData.confirmPassword, formData.agreeTerms]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!formData.password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    PASSWORD_REQUIREMENTS.forEach(req => {
      if (req.regex.test(formData.password)) score++;
    });
    
    const levels = [
      { min: 0, label: 'Too weak', color: 'bg-red-500' },
      { min: 1, label: 'Weak', color: 'bg-orange-500' },
      { min: 2, label: 'Fair', color: 'bg-yellow-500' },
      { min: 3, label: 'Good', color: 'bg-lime-500' },
      { min: 4, label: 'Strong', color: 'bg-green-500' },
      { min: 5, label: 'Very Strong', color: 'bg-green-600' },
    ];
    
    const level = [...levels].reverse().find(l => score >= l.min);
    return { score, label: level.label, color: level.color };
  }, [formData.password]);

  // Check if passwords match in real-time
  const passwordsMatch = useMemo(() => {
    if (!formData.confirmPassword) return null;
    return formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const handleNext = useCallback(() => {
    if (validateStep1()) {
      setStep(2);
      setErrors({});
    }
  }, [validateStep1]);

  const handleBack = useCallback(() => {
    setStep(1);
    setErrors({});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setErrors({});
    
    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
        role: formData.role
      });
      
      if (isMounted.current) {
        toast.success('Account created! Please verify your email.');
        navigate('/verify-email', { 
          state: { email: formData.email },
          replace: true 
        });
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      
      // Handle specific errors
      if (error.response?.data?.field === 'email') {
        setStep(1);
        setErrors({ email: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const getErrorMessage = (error) => {
    if (error.response?.status === 409) {
      return 'An account with this email already exists';
    }
    if (error.response?.status === 429) {
      return 'Too many attempts. Please try again later';
    }
    return error.response?.data?.message || error.message || 'Registration failed. Please try again';
  };

  return (
    <>
      <SEO 
        title="Create Account - HomeScape" 
        description="Join HomeScape and find your dream home with AI-powered property matching" 
      />

      <div className="min-h-screen flex bg-white">
        {/* Left Side - Image */}
        <aside className="hidden lg:block lg:w-1/2 relative" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 z-10" />
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
            <div className="text-center text-white max-w-lg">
              <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of users finding their perfect homes with AI-powered search
              </p>
              
              {/* Features */}
              <div className="space-y-4 text-left">
                {FEATURES.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3"
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {feature.icon}
                    </span>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8" aria-label="Go to homepage">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <HomeIcon />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HomeScape
              </span>
            </Link>

            {/* Progress Steps */}
            <nav aria-label="Registration progress" className="mb-8">
              <ol className="flex items-center gap-4">
                <li className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
                      step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                    aria-current={step === 1 ? 'step' : undefined}
                  >
                    {step > 1 ? <CheckIcon /> : '1'}
                  </div>
                  <span className="text-sm font-medium">Personal Info</span>
                </li>
                
                <li className="flex-1 h-1 bg-gray-200 rounded" aria-hidden="true">
                  <div 
                    className={`h-full bg-blue-600 rounded transition-all duration-300 ${
                      step > 1 ? 'w-full' : 'w-0'
                    }`} 
                  />
                </li>
                
                <li className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
                      step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                    aria-current={step === 2 ? 'step' : undefined}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Security</span>
                </li>
              </ol>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 ? 'Create your account' : 'Set up security'}
              </h1>
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:underline font-medium"
                  state={{ from: location.state?.from }}
                >
                  Sign in
                </Link>
              </p>
            </header>

            {/* General Error */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                  role="alert"
                >
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <Step1Form
                    key="step1"
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    loading={loading}
                    firstNameRef={firstNameRef}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handlePhoneChange={handlePhoneChange}
                    setFormData={setFormData}
                    handleNext={handleNext}
                  />
                )}

                {/* Step 2: Security */}
                {step === 2 && (
                  <Step2Form
                    key="step2"
                    formData={formData}
                    errors={errors}
                    loading={loading}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    passwordStrength={passwordStrength}
                    passwordsMatch={passwordsMatch}
                    passwordRef={passwordRef}
                    setShowPassword={setShowPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    handleBack={handleBack}
                  />
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Icon Components
const LoadingSpinner = ({ size = 'default' }) => (
  <svg
    className={`animate-spin ${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'}`}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CheckIcon = ({ small }) => (
  <svg
    className={small ? "w-3 h-3" : "w-4 h-4"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// Step 1 Component
const Step1Form = ({
  formData,
  errors,
  touched,
  loading,
  firstNameRef,
  handleChange,
  handleBlur,
  handlePhoneChange,
  setFormData,
  handleNext
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-5"
  >
    {/* Name Fields */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            ref={firstNameRef}
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            disabled={loading}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            className={`w-full px-4 py-3 pl-12 rounded-xl border text-gray-900 placeholder-gray-400 transition-all ${
              errors.firstName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
            placeholder="John"
          />
        </div>
        {errors.firstName && (
          <p id="firstName-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.firstName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            disabled={loading}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            className={`w-full px-4 py-3 pl-12 rounded-xl border text-gray-900 placeholder-gray-400 transition-all ${
              errors.lastName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
            placeholder="Doe"
          />
        </div>
        {errors.lastName && (
          <p id="lastName-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.lastName}
          </p>
        )}
      </div>
    </div>

    {/* Email */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          disabled={loading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full px-4 py-3 pl-12 rounded-xl border text-gray-900 placeholder-gray-400 transition-all ${
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
          placeholder="you@example.com"
        />
      </div>
      {errors.email && (
        <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
          {errors.email}
        </p>
      )}
    </div>

    {/* Phone */}
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          disabled={loading}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={`w-full px-4 py-3 pl-12 rounded-xl border text-gray-900 placeholder-gray-400 transition-all ${
            errors.phone
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
          placeholder="(555) 000-0000"
        />
      </div>
      {errors.phone && (
        <p id="phone-error" className="mt-1 text-sm text-red-500" role="alert">
          {errors.phone}
        </p>
      )}
    </div>

    {/* Role Selection */}
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        I want to
      </legend>
      <div className="grid grid-cols-2 gap-3" role="radiogroup">
        {ROLES.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={formData.role === option.value}
            onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
            disabled={loading}
            className={`p-4 rounded-xl border-2 transition-all text-left disabled:cursor-not-allowed ${
              formData.role === option.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1" role="img" aria-hidden="true">
              {option.icon}
            </div>
            <div className="font-medium text-gray-900">{option.label}</div>
            <div className="text-xs text-gray-500">{option.description}</div>
          </button>
        ))}
      </div>
    </fieldset>

    <button
      type="button"
      onClick={handleNext}
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continue
    </button>
  </motion.div>
);

// Step 2 Component
const Step2Form = ({
  formData,
  errors,
  loading,
  showPassword,
  showConfirmPassword,
  passwordStrength,
  passwordsMatch,
  passwordRef,
  setShowPassword,
  setShowConfirmPassword,
  handleChange,
  setFormData,
  handleBack
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-5"
  >
    {/* Password */}
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange('password')}
          disabled={loading}
          aria-invalid={!!errors.password}
          aria-describedby="password-requirements password-error"
          className={`w-full px-4 py-3 pl-12 rounded-xl border text-gray-900 placeholder-gray-400 transition-all pr-12 ${
            errors.password
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      
      {errors.password && (
        <p id="password-error" className="mt-1 text-sm text-red-500" role="alert">
          {errors.password}
        </p>
      )}

      {/* Password Strength Indicator */}
      {formData.password && (
        <div className="mt-3" id="password-requirements">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded transition-colors ${
                  i < passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Strength: <span className="font-medium">{passwordStrength.label}</span>
          </p>
          
          {/* Requirements Checklist */}
          <div className="grid grid-cols-2 gap-1">
            {PASSWORD_REQUIREMENTS.slice(0, 4).map((req, i) => (
              <div 
                key={i} 
                className={`text-xs flex items-center gap-1 ${
                  req.regex.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {req.regex.test(formData.password) ? <CheckIcon small /> : <span>○</span>}
                {req.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Confirm Password */}
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          disabled={loading}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          className={`w-full px-4 py-3 pl-12 rounded-xl border text-gray-900 placeholder-gray-400 transition-all pr-12 ${
            errors.confirmPassword
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : passwordsMatch === true
                ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(prev => !prev)}
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      
      {errors.confirmPassword && (
        <p id="confirmPassword-error" className="mt-1 text-sm text-red-500" role="alert">
          {errors.confirmPassword}
        </p>
      )}
      
      {passwordsMatch === true && !errors.confirmPassword && (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
          <CheckIcon small /> Passwords match
        </p>
      )}
    </div>

    {/* Terms Agreement */}
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
          disabled={loading}
          aria-invalid={!!errors.agreeTerms}
          aria-describedby={errors.agreeTerms ? 'terms-error' : undefined}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 disabled:cursor-not-allowed"
        />
        <span className="text-sm text-gray-600">
          I agree to the{' '}
          <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-blue-600 hover:underline" target="_blank">
            Privacy Policy
          </Link>
        </span>
      </label>
      {errors.agreeTerms && (
        <p id="terms-error" className="mt-1 text-sm text-red-500" role="alert">
          {errors.agreeTerms}
        </p>
      )}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleBack}
        disabled={loading}
        className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span>Creating...</span>
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </div>
  </motion.div>
);

export default Register;