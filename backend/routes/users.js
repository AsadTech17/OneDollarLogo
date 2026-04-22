const { doc, setDoc, getDoc } = require('../firebaseController');

// Store user in Firestore
const storeUser = async (req, res) => {
  try {
    const { uid, email, name, credits } = req.body;

    if (!uid || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields: uid, email, name' });
    }

    // Check if user already exists
    const userDoc = await getDoc('users', uid);
    
    if (!userDoc.exists) {
      // Create new user document
      await setDoc('users', uid, {
        uid,
        email,
        name,
        credits: credits || 0,
        createdAt: new Date().toISOString()
      });
    }

    res.status(200).json({ 
      message: 'User stored successfully',
      user: { uid, email, name, credits }
    });
  } catch (error) {
    console.error('Error storing user:', error);
    res.status(500).json({ error: 'Failed to store user' });
  }
};

module.exports = { storeUser };
