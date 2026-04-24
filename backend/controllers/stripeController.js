import Stripe from 'stripe';
import { db, admin } from '../firebaseAdmin.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Price mapping for your plans with amounts in cents
const PRICE_MAPPING = {
  starter: {
    amount: 900, // $9.00
    credits: 25,
    name: 'Starter Pack'
  },
  growth: {
    amount: 2400, // $24.00
    credits: 75,
    name: 'Growth Pack'
  },
  pro: {
    amount: 4500, // $45.00
    credits: 150,
    name: 'Professional Pack'
  },
  professional: {
    amount: 4500, // $45.00
    credits: 150,
    name: 'Professional Pack'
  },
  enterprise: {
    amount: 7900, // $79.00
    credits: 300,
    name: 'Enterprise Pack'
  }
};

// Create checkout session
export const createCheckoutSession = async (req, res) => {
  console.log('Stripe checkout session endpoint hit!');
  console.log('Request body:', req.body);
  console.log('Authenticated user:', req.user);
  
  try {
    const { planName } = req.body;
    const userId = req.user.uid; // Get userId from authenticated user

    if (!planName) {
      return res.status(400).json({
        success: false,
        message: 'Plan name is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const plan = PRICE_MAPPING[planName];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan name'
      });
    }

    console.log('🔍 Creating Stripe session with plan:', planName);
    console.log('💰 Plan details:', plan);
    console.log('📦 Line items to be sent:', {
      price_data: {
        currency: 'usd',
        product_data: { 
          name: plan.name + ' Pack',
          description: `${plan.credits} credits for logo generation`
        },
        unit_amount: plan.amount,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { 
              name: plan.name + ' Pack',
              description: `${plan.credits} credits for logo generation`
            },
            unit_amount: plan.amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        planName: planName,
        credits: plan.credits.toString(),
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session'
    });
  }
};

// Handle webhook events
export const handleWebhook = async (req, res) => {
  console.log('🔥 WEBHOOK HIT! Stripe webhook endpoint called');
  console.log('Headers:', req.headers);
  
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.log('❌ No Stripe signature found');
    return res.status(400).json({ 
      success: false, 
      message: 'Stripe signature missing' 
    });
  }

  console.log('✅ Stripe signature found:', sig.substring(0, 20) + '...');

  let event;

  try {
    console.log('🔐 Verifying webhook signature...');
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook signature verified successfully');
    console.log('📦 Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ 
      success: false, 
      message: `Webhook Error: ${err.message}` 
    });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    console.log('💰 Payment completed! Processing session...');
    const session = event.data.object;
    console.log('📋 Session data:', JSON.stringify(session, null, 2));
    
    try {
      const { userId, planName, credits } = session.metadata;
      
      console.log('📊 Extracted metadata:', { userId, planName, credits });
      console.log(`🎯 Processing successful payment for user ${userId}, plan: ${planName}, credits: ${credits}`);

      // Add credits to user's Firestore document
      console.log('🔍 Looking up user in Firestore...');
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.error(`❌ User ${userId} not found in Firestore`);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ User found in Firestore');
      const currentCredits = userDoc.data().credits || 0;
      const creditsToAdd = parseInt(credits, 10);
      
      console.log(`💳 Current credits: ${currentCredits}, Adding: ${creditsToAdd}`);
      
      await userRef.update({
        credits: admin.firestore.FieldValue.increment(creditsToAdd),
        lastPurchaseAt: new Date(),
        lastPurchasePlan: planName,
        stripeSessionId: session.id
      });

      console.log(`✅ Successfully added ${creditsToAdd} credits to user ${userId}`);

      // Optional: Create a purchase record
      await db.collection('purchases').add({
        userId: userId,
        planName: planName,
        credits: creditsToAdd,
        amount: session.amount_total / 100, // Convert from cents to dollars
        currency: session.currency,
        stripeSessionId: session.id,
        createdAt: new Date()
      });

    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      console.error('Stack trace:', error.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to process payment'
      });
    }
  } else {
    console.log(`ℹ️ Received unhandled event type: ${event.type}`);
  }

  console.log('🎉 Webhook processed successfully');
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
