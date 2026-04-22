import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Pricing = () => {
  const [userCredits, setUserCredits] = useState(0);
  const [selectedPack, setSelectedPack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, getIdToken } = useAuth();

  const CREDIT_PACKS = {
    starter: { name: 'Starter Pack', credits: 25, price: 9.99, description: 'Perfect for getting started', features: ['25 credits', 'Basic logo generation', 'Standard quality'] },
    growth: { name: 'Growth Pack', credits: 75, price: 24.99, description: 'Great for growing businesses', features: ['75 credits', 'Advanced logo generation', 'High quality', 'Priority support'] },
    professional: { name: 'Professional Pack', credits: 200, price: 49.99, description: 'Ideal for professionals', features: ['200 credits', 'Premium logo generation', 'Unlimited revisions', 'Commercial license'] },
    enterprise: { name: 'Enterprise Pack', credits: 500, price: 99.99, description: 'Best for large teams', features: ['500 credits', 'Custom branding', 'Dedicated support', 'API access'] }
  };

  // Fetch user credits on component mount
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return;
      
      try {
        const response = await api.get('/api/credits/balance');
        
        setUserCredits(response.data.data?.credits || 0);
      } catch (error) {
        console.error('Error fetching user credits:', error);
      }
    };

    if (user) {
      fetchUserCredits();
    }
  }, [user, getIdToken]);

  const handlePurchasePack = async (packId) => {
    if (!user) {
      setMessage('Please login to purchase credits');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/api/credits/buy-pack', { packId });

      if (response.data.success) {
        setUserCredits(response.data.data?.totalCredits || 0);
        setMessage(`${response.data.data?.packName || 'Credit Pack'} purchased successfully! You now have ${response.data.data?.totalCredits || 0} credits.`);
        setSelectedPack(null);
      } else {
        setMessage(response.data.message || 'Failed to purchase credit pack');
      }
    } catch (error) {
      console.error('Error purchasing credit pack:', error);
      setMessage('Failed to purchase credit pack. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Credit Pack
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Purchase credits to unlock premium logo features and unlimited revisions
          </p>
        </div>

        {/* Current Credits Display */}
        {user && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Current Balance
              </h2>
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {userCredits} Credits
              </p>
            </div>
          </div>
        )}

        {/* Credit Packs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(CREDIT_PACKS).map(([packId, pack]) => (
            <div
              key={packId}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl hover:border-blue-500 cursor-pointer ${
                selectedPack === packId ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedPack(packId)}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pack.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {pack.description}
                </p>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {pack.credits} Credits
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  ${pack.price}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                <ul className="space-y-2">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Button */}
        {selectedPack && (
          <div className="text-center mt-8">
            <button
              onClick={() => handlePurchasePack(selectedPack)}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 disabled:transform-none focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              {isLoading ? 'Processing...' : `Purchase ${CREDIT_PACKS[selectedPack].name}`}
            </button>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center ${
            message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            Back to Generator
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
