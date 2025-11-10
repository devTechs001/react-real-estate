import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { authService } from '../services/authService';
import Loader from '../components/common/Loader';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      await authService.verifyEmail(token);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now access all features.
            </p>
            <Link to="/login" className="btn btn-primary inline-block">
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-5xl text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/login" className="btn btn-primary inline-block">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;