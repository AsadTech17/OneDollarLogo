import { createUserInFirestore } from '../firebaseAdmin.js';

// Create or update user in Firestore
export const createUser = async (req, res) => {
  try {
    // Verify the Firebase ID token
    const { auth, getUserProfile } = await import('../firebaseAdmin.js');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get user data from request body
    const { uid, email, displayName, photoURL } = req.body;
    
    // Validate that the UID from token matches the UID in request body
    if (decodedToken.uid !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Token UID does not match request UID'
      });
    }

    // Create user in Firestore (this function handles upsert logic)
    const isNewUser = await createUserInFirestore({
      uid: decodedToken.uid,
      email: decodedToken.email || email,
      displayName: decodedToken.name || displayName,
      photoURL: decodedToken.picture || photoURL,
    });

    // Get the updated user profile
    const userProfile = await getUserProfile(decodedToken.uid);

    res.json({
      success: true,
      message: isNewUser ? 'User created successfully' : 'User logged in successfully',
      data: userProfile
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token expired. Please log in again.'
      });
    } else if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token revoked. Please log in again.'
      });
    } else if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error creating user. Please try again.',
        error: error.message
      });
    }
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { auth } = await import('../firebaseAdmin.js');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    const { getUserProfile } = await import('../firebaseAdmin.js');
    const userProfile = await getUserProfile(decodedToken.uid);

    res.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token expired. Please log in again.'
      });
    } else if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error getting user profile. Please try again.'
      });
    }
  }
};
