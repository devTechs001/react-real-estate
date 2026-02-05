// client/src/pages/VerifyEmail.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/VerifyEmail.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newCode.every((digit) => digit) && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    while (newCode.length < 6) newCode.push('');
    setCode(newCode);

    if (newCode.every((digit) => digit)) {
      handleVerify(newCode.join(''));
    }
  };

  const handleVerify = async (verificationCode) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Verification code resent!');
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <SEO title="Verify Email - HomeScape" description="Verify your email address" />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Code Input */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all ${
                  digit
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:opacity-50`}
              />
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center gap-2 mb-6 text-blue-600">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">Didn't receive the code?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 font-medium hover:underline disabled:opacity-50"
              >
                {resending ? 'Resending...' : 'Resend code'}
              </button>
            ) : (
              <p className="text-gray-500">
                Resend in <span className="font-medium text-gray-900">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link to="/register" className="text-gray-600 hover:text-gray-900">
              ← Back to registration
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyEmail;