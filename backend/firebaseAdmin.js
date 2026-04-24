import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables for both local and Vercel deployment
if (process.env.NODE_ENV === 'production') {
  // Vercel provides environment variables directly
} else {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// Configure Cloudinary at top level
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
    });

  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

// Export Firestore, Auth, Storage instances, and admin
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export { admin };

// Get the storage bucket name
const bucketName = `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;

// User management functions
export const createUserInFirestore = async (user) => {
  try {
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user document with free tier credits
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || null,
        credits: 1, // Free tier: 1 credit
        tier: 'free',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        totalGenerations: 0,
      });

      return true;
    } else {
      // Update last login time for existing user
      await userRef.update({
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return false;
    }
  } catch (error) {
    throw error;
  }
};

// Credits management functions
export const checkUserCredits = async (uid) => {
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found in Firestore');
    }

    const userData = userDoc.data();
    return userData.credits || 0;
  } catch (error) {
    throw error;
  }
};

export const deductUserCredit = async (uid) => {
  try {
    const userRef = db.collection('users').doc(uid);
    
    // Use transaction to safely decrement credits
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error('User not found in Firestore');
      }

      const currentCredits = userDoc.data().credits || 0;
      
      if (currentCredits <= 0) {
        throw new Error('Insufficient credits');
      }

      // Deduct one credit and increment generations
      transaction.update(userRef, {
        credits: admin.firestore.FieldValue.increment(-1),
        totalGenerations: admin.firestore.FieldValue.increment(1),
        lastGenerationAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    console.log('Credit deducted for user:', uid);
    return true;
  } catch (error) {
    console.error('Error deducting user credit:', error);
    throw error;
  }
};

// Logo generation tracking functions
export const saveLogoGeneration = async (uid, generationData) => {
  try {
    const generationsRef = db.collection('generations');
    
    const generationDoc = {
      uid: uid,
      businessIdea: generationData.businessIdea,
      brandName: generationData.brandName,
      niche: generationData.niche,
      vibe: generationData.vibe,
      logos: generationData.logos.map(logo => ({
        style: logo.style,
        description: logo.description,
        colors: logo.colors,
        typography: logo.typography,
        values: logo.values,
        imageUrl: logo.imageUrl,
        imageId: logo.imageId,
      })),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed',
    };

    const result = await generationsRef.add(generationDoc);
    return result.id;
  } catch (error) {
    throw error;
  }
};

// Get user's generation history
export const getUserGenerations = async (uid, limit = 10) => {
  try {
    const generationsRef = db.collection('generations')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const snapshot = await generationsRef.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    throw error;
  }
};

// Get user profile data
export const getUserProfile = async (uid) => {
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    return {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      credits: userData.credits,
      tier: userData.tier,
      totalGenerations: userData.totalGenerations,
      createdAt: userData.createdAt?.toDate(),
      lastLoginAt: userData.lastLoginAt?.toDate(),
    };
  } catch (error) {
    throw error;
  }
};

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (imageUrl, logoIndex, brandName, watermarkedBuffer = null) => {
  try {
    // Upload image to Cloudinary
    const uploadOptions = {
      folder: 'one_dollar_logos',
      public_id: `${brandName.replace(/\s+/g, '_').toLowerCase()}_logo_${logoIndex + 1}_${Date.now()}`,
      resource_type: 'image',
      format: 'png',
      quality: 'auto:good',
      fetch_format: 'auto',
    };
    
    let result;
    
    if (watermarkedBuffer) {
      // Upload watermarked buffer directly using Promise wrapper
      console.log('--- Step 6: Starting Cloudinary upload_stream ---');
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: 'logos',
            resource_type: 'image',
            format: 'png',
            quality: 'auto:good',
            fetch_format: 'auto'
          },
          (error, result) => {
            if (result) {
              console.log('--- Step 7: Final Cloudinary URL:', result.secure_url);
              resolve(result);
            } else {
              console.log('Cloudinary upload error:', error.message || error);
              reject(error);
            }
          }
        );
        stream.end(watermarkedBuffer);
      });
    } else {
      // Fallback to uploading URL (for placeholder images)
      result = await cloudinary.uploader.upload(imageUrl, uploadOptions);
      console.log('--- Step 7: Final Cloudinary URL:', result.secure_url);
    }
    
    // Return secure URL
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
    
  } catch (error) {
    throw error;
  }
};

export default admin;
