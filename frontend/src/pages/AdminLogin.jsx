import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated and redirect if admin
    if (isAuthenticated && user) {
      checkAdminAccess();
    }
  }, [user, isAuthenticated]);

  const checkAdminAccess = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (!adminEmail) {
      setError('Admin email not configured. Please contact support.');
      return;
    }

    if (user.email === adminEmail) {
      navigate('/admin/dashboard');
    } else {
      handleUnauthorizedAccess();
    }
  };

  const handleUnauthorizedAccess = async () => {
    try {
      // Sign out the unauthorized user
      const { signOut, auth } = await import('../lib/firebase');
      await signOut(auth);
      setError('Access Denied: You are not an admin');
    } catch (error) {
      console.error('Error signing out unauthorized user:', error);
      setError('Access Denied: You are not an admin');
    }
  };

  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Sign in with Google
      await signInWithGoogle();
      
      // The useEffect will handle the admin check and redirect
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleAdminLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="font-medium">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Admin Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-600 text-sm text-center">
              <strong>Note:</strong> Only registered administrators can access this dashboard.
            </p>
          </div>

          {/* Back to Site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
            >
              &larr; Back to main site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
