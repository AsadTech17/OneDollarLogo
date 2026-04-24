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
    name: 'Pro Pack'
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
    
    // STEP 1: Log webhook hit with event type
    console.log(`> [STRIPE WEBHOOK] Webhook received | Event Type: ${event.type}`);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ 
      success: false, 
      message: `Webhook Error: ${err.message}` 
    });
  }

  // IMMEDIATE RESPONSE AFTER SIGNATURE VERIFICATION
  res.status(200).json({ received: true });
  console.log('🚀 Immediate response sent to Stripe, processing in background...');

  // STRICT EVENT CHECK: ONLY process checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    console.log('💰 Payment completed! Processing session...');
    const session = event.data.object;
    console.log('📋 Session data:', JSON.stringify(session, null, 2));
    
    // BACKGROUND PROCESSING - Don't wait for this to complete
    processPaymentAsync(session).catch(error => {
      console.error('❌ Background processing failed:', error);
    });
  } else {
    console.log(`ℹ️ Received unhandled event type: ${event.type}`);
  }
  
  console.log('🎉 Webhook processed successfully');
};

// Background processing function
async function processPaymentAsync(session) {
  try {
    const { userId, planName, credits } = session.metadata;
    
    // STEP 2: Log idempotency check with session ID
    console.log(`> [STRIPE WEBHOOK] Idempotency check started | Session: ${session.id}`);
    
    // STEP 3: Log user ID and plan name from metadata
    console.log(`> [STRIPE WEBHOOK] User: ${userId} | Plan: ${planName} | Credits: ${credits}`);
    
    // FIRESTORE IDEMPOTENCY CHECK: Check if this session has already been processed
    const paymentDoc = await db.collection('processed_payments').doc(session.id).get();
    
    if (paymentDoc.exists) {
      console.log(`> [STRIPE WEBHOOK] ALREADY PROCESSED | Session: ${session.id} | Skipping credit addition`);
      console.log('📋 Processed payment data:', paymentDoc.data());
      return { alreadyProcessed: true, sessionId: session.id };
    }
    
    console.log('✅ Payment not yet processed, proceeding with credit addition');
    
    // IMMEDIATELY MARK AS PROCESSING to prevent race condition
    await db.collection('processed_payments').doc(session.id).set({ 
      status: 'processing',
      sessionId: session.id,
      userId: userId,
      planName: planName,
      creditsToAdd: parseInt(credits, 10),
      startedAt: new Date()
    });
    
    console.log(`> [STRIPE WEBHOOK] Marked as processing | Session: ${session.id}`);

    // Add credits to user's Firestore document
    console.log('🔍 Looking up user in Firestore...');
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`❌ User ${userId} not found in Firestore`);
      return { success: false, message: 'User not found' };
    }

    console.log('✅ User found in Firestore');
    const currentCredits = userDoc.data().credits || 0;
    const creditsToAdd = parseInt(credits, 10);
    
    // STEP 4: Log exact credit amount being added
    console.log(`> [STRIPE WEBHOOK] Adding ${creditsToAdd} credits to user ${userId} for ${planName}`);
    console.log(`💳 Current credits: ${currentCredits}, Adding: ${creditsToAdd}`);
    console.log('🔄 Executing Firestore credit increment...');
    
    await userRef.update({
      credits: admin.firestore.FieldValue.increment(creditsToAdd),
      lastPurchaseAt: new Date(),
      lastPurchasePlan: planName,
      stripeSessionId: session.id
    });

    // STEP 5: Log success after Firestore update
    console.log(`> [STRIPE WEBHOOK] SUCCESS | User: ${userId} | Plan: ${planName} | Credits Added: ${creditsToAdd} | Session: ${session.id}`);
    console.log(`✅ Successfully added ${creditsToAdd} credits to user ${userId}`);

    // UPDATE PAYMENT STATUS TO COMPLETED
    console.log('📝 Updating payment status to completed...');
    await db.collection('processed_payments').doc(session.id).update({ 
      status: 'completed',
      processedAt: new Date(),
      creditsAdded: creditsToAdd
    });
    
    console.log('✅ Payment marked as completed in processed_payments collection');
    console.log('🎯 Credit addition process completed successfully');

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
    
    console.log('✅ Background processing completed successfully');
    return { success: true, creditsAdded: creditsToAdd };

  } catch (error) {
    // STEP 5: Log error if Firestore update fails
    console.log(`> [STRIPE WEBHOOK] ERROR | User: ${userId || 'unknown'} | Plan: ${planName || 'unknown'} | Error: ${error.message}`);
    console.error('❌ Background processing failed:', error);
    console.error('Stack trace:', error.stack);
    return { success: false, message: 'Failed to process payment' };
  }
}
