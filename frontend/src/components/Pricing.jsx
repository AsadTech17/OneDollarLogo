// @ts-nocheck
/** @type {import('react').StateSetter<string>} */
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";

const Pricing = () => {
  const { user, isAuthenticated, getIdToken } = useAuth();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchasePack = async (packId) => {
    if (!isAuthenticated) {
      setMessage("Please login to purchase credits");
      return;
    }

    setProcessingId(packId);
    setIsLoading(true);
    setMessage("");
    setShowSuccess(false);

    try {
      // Create Stripe checkout session
      const response = await api.post('/api/stripe/create-checkout-session', {
        planName: packId
      });

      if (response.data.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setMessage(response.data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setMessage('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessingId(null);
    }
  };

  // Check for successful payment from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      setMessage('Payment successful! Credits have been added to your account.');
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 3000);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === 'false') {
      setMessage('Payment was cancelled. Please try again.');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const creditPacks = [
    {
      name: "Starter Pack",
      price: "$9",
      credits: "25 OPPAL",
      description: "Perfect for getting started",
      features: [
        "25 OPPAL credits",
        "2 Standard logos (10 OPPAL each)",
        "5 credits remaining for upgrades",
        "Valid for 6 months",
        "Email support",
      ],
      color: "border-blue-600",
      badge: null,
      popular: false,
      packId: "starter",
    },
    {
      name: "Growth Pack",
      price: "$24",
      credits: "75 OPPAL",
      description: "Best value for growing businesses",
      features: [
        "75 OPPAL credits",
        "3 Premium logos (20 OPPAL each)",
        "15 credits remaining for upgrades",
        "Valid for 12 months",
        "Priority support",
      ],
      color: "border-purple-600",
      badge: "POPULAR",
      popular: true,
      packId: "growth",
    },
    {
      name: "Pro Pack",
      price: "$45",
      credits: "150 OPPAL",
      description: "For professionals and agencies",
      features: [
        "150 OPPAL credits",
        "4 Exclusive logos (35 OPPAL each)",
        "10 credits remaining for upgrades",
        "Valid for 12 months",
        "Priority support",
      ],
      color: "border-purple-600",
      badge: null,
      popular: false,
      packId: "professional",
    },
    {
      name: "Enterprise Pack",
      price: "$79",
      credits: "300 OPPAL",
      description: "Maximum flexibility for teams",
      features: [
        "300 OPPAL credits",
        "8 Exclusive logos (35 OPPAL each)",
        "20 credits remaining for upgrades",
        "Valid for 18 months",
        "Dedicated account manager",
      ],
      color: "border-gray-600",
      badge: null,
      popular: false,
      packId: "enterprise",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Purchase credits to unlock professional logo designs
          </p>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-700">
                    Credits added to your account
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credit Packs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${
                pack.popular ? "border-blue-600 shadow-lg transform scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {pack.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <span className="text-sm font-semibold">{pack.badge}</span>
                  </div>
                </div>
              )}
              <div className="p-6">
                {/* Pack Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pack.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {pack.price}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-1 mb-2">
                    <span className="text-gray-700 font-semibold">
                      {pack.credits}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{pack.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {pack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-4 h-4 bg-green-100 rounded-full mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchasePack(pack.packId)}
                  disabled={processingId === pack.packId || isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    pack.popular
                      ? "bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white"
                      : "border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600"
                  }`}
                >
                  {processingId === pack.id ? (
                    <span className="flex items-center justify-center">
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-solid border-current border-r-purple-600 border-t-transparent"></span>
                      <span className="ml-2">Processing...</span>
                    </span>
                  ) : (
                    "Purchase Pack"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-[11px] max-w-3xl mx-auto">
            OPPAL credits are non-cash digital credits and are non-refundable
            once consumed. Credits are valid for use across the Leviathan
            platform ecosystem.
          </p>
        </div>

        {/* Credits Info */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            How OPPAL Credits Work
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Purchase credit packs and use them to unlock professional logo
            designs. Credits never expire and can be used across the Leviathan
            platform.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-2">10</div>
              <div className="text-gray-600 text-sm">Standard Logo</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-2">20</div>
              <div className="text-gray-600 text-sm">Premium Logo</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-2">35</div>
              <div className="text-gray-600 text-sm">Exclusive Logo</div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-lg text-center ${
              message.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
