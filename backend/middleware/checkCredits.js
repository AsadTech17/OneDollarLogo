import { checkUserCredits, deductUserCredit } from '../firebaseAdmin.js';

// Middleware to check if user has sufficient credits
export const checkCredits = async (req, res, next) => {
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

    // Check user credits
    const credits = await checkUserCredits(uid);
    
    if (credits <= 0) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient credits. Please upgrade your plan to generate more logos.',
        credits: credits
      });
    }

    // Add user info to request for downstream use
    req.user = {
      uid: uid,
      email: decodedToken.email,
      displayName: decodedToken.name || 'User',
    };

    next();
  } catch (error) {
    console.error('Credits check error:', error);
    
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
    } else if (error.message === 'User not found in Firestore') {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please contact support.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error checking credits. Please try again.'
      });
    }
  }
};

// Middleware to deduct credits after successful generation
export const deductCredits = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Deduct one credit
    await deductUserCredit(req.user.uid);
    
    // Add remaining credits to response
    const { checkUserCredits } = await import('../firebaseAdmin.js');
    const remainingCredits = await checkUserCredits(req.user.uid);
    
    // Add credits info to response locals for downstream use
    res.locals.remainingCredits = remainingCredits;
    
    next();
  } catch (error) {
    console.error('Credit deduction error:', error);
    
    if (error.message === 'Insufficient credits') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient credits. Please upgrade your plan.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error processing credits. Please try again.'
      });
    }
  }
};
