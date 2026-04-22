import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      if (!isAuthenticated || !user) {
        navigate('/admin/login');
        return;
      }

      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (!adminEmail) {
        console.error('Admin email not configured');
        navigate('/admin/login');
        return;
      }

      // Check if user email matches admin email
      if (user.email === adminEmail) {
        setIsAdmin(true);
      } else {
        // User is not admin, sign them out and redirect
        handleUnauthorizedAccess();
      }
      
      setIsLoading(false);
    };

    const handleUnauthorizedAccess = async () => {
      try {
        // Sign out the unauthorized user
        const { signOut, auth } = await import('../lib/firebase');
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out unauthorized user:', error);
      } finally {
        // Show error message and redirect
        alert('Access Denied: You are not an admin');
        navigate('/admin/login');
      }
    };

    checkAdminAccess();
  }, [user, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default AdminProtectedRoute;
