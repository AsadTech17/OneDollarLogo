// Simple authentication middleware to verify Firebase token and attach user to req.user
export const authenticateUser = async (req, res, next) => {
  try {
    // Get the Firebase ID token from the Authorization header
    const authHeader = req.headers.authorization;
    
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Bearer token found in headers');
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Token extracted, length:', token.length);
    
    // Verify the Firebase ID token
    const { auth } = await import('../firebaseAdmin.js');
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    console.log('Token verified successfully for uid:', uid);

    // Attach user info to request for downstream use
    req.user = {
      uid: uid,
      email: decodedToken.email,
      displayName: decodedToken.name || 'User',
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
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
        message: 'Authentication error. Please try again.'
      });
    }
  }
};
