import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { auth, onAuthStateChanged, signInWithPopup, googleProvider } from '../lib/firebase';
import api from '../api/axios';

const AuthContext = createContext();

// Function to create user in Firestore
const createUserInFirestore = async (user) => {
  try {
    const idToken = await user.getIdToken();
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    
    console.log('Sending user data to backend:', userData);
    
    const response = await api.post('/api/users/create', userData);
    
    if (!response.data.success) {
      console.error('Backend response error:', response.data.message);
      throw new Error(`Failed to create user: ${response.data.message || 'Unknown error'}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      // Ensure auth and googleProvider are properly initialized
      if (!auth || !googleProvider) {
        throw new Error('Firebase auth or provider not initialized');
      }

      // Call signInWithPopup with exactly two arguments: (auth, googleProvider)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create user in Firestore
      try {
        await createUserInFirestore(user);
        setUser(user);
        return user;
      } catch (firestoreError) {
        console.error('User creation in Firestore failed:', firestoreError);
        // Log out Firebase user to keep states consistent
        try {
          await auth.signOut();
        } catch (signOutError) {
          console.error('Failed to sign out user:', signOutError);
        }
        setUser(null);
        throw new Error('Failed to create user account. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setUser(null);
      throw error;
    }
  };

  // Function to get Firebase ID token for API authentication
  const getIdToken = async () => {
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    // Get fresh token and update localStorage
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
    return token;
  };

  useEffect(() => {
    // Ensure auth is properly initialized before setting up listener
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Store or remove auth token in localStorage
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('authToken', token);
          console.log('Auth token stored in localStorage');
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
      } else {
        localStorage.removeItem('authToken');
        console.log('Auth token removed from localStorage');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle,
    getIdToken
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
