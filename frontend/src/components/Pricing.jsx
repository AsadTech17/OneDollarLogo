// @ts-nocheck
/** @type {import('react').StateSetter<string>} */
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle2 } from "lucide-react";
import api from "../api/axios";

const Pricing = () => {
  const { user, isAuthenticated, getIdToken } = useAuth();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handlePurchasePack = async (packId) => {
    if (!isAuthenticated) {
      setMessage("Please login to purchase credits");
      return;
    }

    setProcessingId(packId);
    setIsLoading(true);
    setMessage("");

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

  // Check for cancelled payment from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const canceled = urlParams.get('canceled');
    
    if (canceled === 'true') {
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
      description: "Best for testing ideas.",
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
      description: "Best for founders launching real brands.",
      features: [
        "75 OPPAL credits",
        "3 Premium logos (20 OPPAL each)",
        "15 credits remaining for upgrades",
        "Valid for 12 months",
        "Priority support",
      ],
      color: "border-purple-600",
      badge: "MOST CHOSEN",
      popular: true,
      packId: "growth",
    },
    {
      name: "Pro Pack",
      price: "$45",
      credits: "150 OPPAL",
      description: "Best for professionals and creators.",
      features: [
        "150 OPPAL credits",
        "6 Exclusive logos (35 OPPAL each)",
        "10 credits remaining for upgrades",
        "Valid for 12 months",
        "Priority support",
      ],
      color: "border-purple-600",
      badge: null,
      popular: false,
      packId: "pro",
    },
    {
      name: "Enterprise Pack",
      price: "$79",
      credits: "300 OPPAL",
      description: "Best for teams and agencies.",
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
      className="py-2 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-gray-600 max-w-4xl mx-auto whitespace-nowrap">
            Buy OPPAL credits once. Use them to create, refine, and export your brand assets.
          </p>
        </div>

        {/* Credit Packs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col ${
                pack.popular ? "border-red-600 shadow-lg transform scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {pack.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center whitespace-nowrap">
                    <span className="text-sm font-semibold">{pack.badge}</span>
                  </div>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                {/* Pack Header */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pack.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {pack.price === "$24" ? (
                        <span className="text-red-600">{pack.price}</span>
                      ) : (
                        <span className="text-[#0a1d37]">{pack.price}</span>
                      )}
                    </span>
                  </div>
                  <div className={`bg-gray-100 rounded-lg px-3 py-1 mb-2 text-green-700 font-semibold`}>
                      {pack.credits}
                    </div>
                  <p className="text-gray-600 text-[12px]">{pack.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-2 mb-4 flex-1">
                  {pack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#16a34a] flex items-center justify-center mr-3 mt-1">
                        <svg 
                          className="w-2.5 h-2.5 text-white" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                       <span className="text-gray-600 text-[13px]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchasePack(pack.packId)}
                  disabled={processingId === pack.packId || isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    pack.popular
                      ? "bg-red-600 hover:bg-red-700 focus:bg-red-800 text-white"
                      : "border border-[#1e3a8a] text-gray-900 hover:bg-[#1e3a8a] hover:bg-opacity-10"
                  }`}
                >
                  {processingId === pack.packId ? (
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
