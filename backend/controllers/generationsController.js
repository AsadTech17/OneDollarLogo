import { getUserGenerations as fetchUserGenerations } from '../firebaseAdmin.js';

// Get user's generations
export const getUserGenerations = async (req, res) => {
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
    
    // Use UID from URL params as requested in the error log
    const uid = req.params.uid;
    
    // Validate that the authenticated user matches the requested UID
    if (decodedToken.uid !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only access your own generations'
      });
    }

    // Get query parameters for pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const generations = await fetchUserGenerations(uid, limit);

    res.json({
      success: true,
      data: generations,
      pagination: {
        page: page,
        limit: limit,
        hasMore: generations.length === limit
      }
    });

  } catch (error) {
    console.error('Error getting user generations:', error);
    
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
        message: 'Error getting generations. Please try again.'
      });
    }
  }
};
