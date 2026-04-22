import admin from 'firebase-admin';
const db = admin.firestore();

// Credit pack configurations
const CREDIT_PACKS = {
  starter: { name: 'Starter Pack', credits: 25, price: 9.99 },
  growth: { name: 'Growth Pack', credits: 75, price: 24.99 },
  professional: { name: 'Professional Pack', credits: 200, price: 49.99 },
  enterprise: { name: 'Enterprise Pack', credits: 500, price: 99.99 }
};

// Spending tier configurations
const SPENDING_TIERS = {
  standard: { name: 'Standard', credits: 10 },
  premium: { name: 'Premium', credits: 20 },
  exclusive: { name: 'Exclusive', credits: 35 }
};

// 1. Get user credit balance
export const getCreditBalance = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.json({ success: true, data: { credits: 0 } });
    }

    const userData = doc.data();
    res.json({
      success: true,
      data: {
        credits: userData.credits || 0,
        lastCreditPurchase: userData.lastCreditPurchase,
        lastLogoUnlock: userData.lastLogoUnlock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Buy credit pack
export const buyCreditPack = async (req, res) => {
  try {
    const { packId } = req.body;
    const userId = req.user.uid;
    const pack = CREDIT_PACKS[packId];

    if (!pack) return res.status(400).json({ message: 'Invalid pack ID' });

    const userRef = db.collection('users').doc(userId);
    
    await userRef.set({
      credits: admin.firestore.FieldValue.increment(pack.credits),
      lastCreditPurchase: new Date().toISOString(),
      lastPurchasePack: pack.name
    }, { merge: true });

    const updatedDoc = await userRef.get();
    res.json({
      success: true,
      message: `${pack.name} added!`,
      totalCredits: updatedDoc.data().credits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Unlock logo
export const unlockLogo = async (req, res) => {
  try {
    const { logoId, tier } = req.body;
    const userId = req.user.uid;
    const tierConfig = SPENDING_TIERS[tier];

    if (!tierConfig) return res.status(400).json({ message: 'Invalid tier' });

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const currentCredits = userDoc.data()?.credits || 0;

    if (currentCredits < tierConfig.credits) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    await userRef.update({
      credits: admin.firestore.FieldValue.increment(-tierConfig.credits),
      lastLogoUnlock: new Date().toISOString()
    });

    await userRef.collection('unlockedLogos').doc(logoId).set({
      unlockedAt: new Date().toISOString(),
      tier: tier,
      creditsSpent: tierConfig.credits
    }, { merge: true });

    res.json({ success: true, message: 'Logo unlocked successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Missing Functions Added Below ---

export const getCreditPacks = async (req, res) => {
  res.json({ success: true, data: CREDIT_PACKS });
};

export const getSpendingTiers = async (req, res) => {
  res.json({ success: true, data: SPENDING_TIERS });
};