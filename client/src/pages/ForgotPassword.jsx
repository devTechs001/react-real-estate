import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaEnvelope className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            We've sent a password reset link to <strong className="text-white">{email}</strong>. Check your inbox and click the link to reset your password.
          </p>
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-400">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              className="mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;