import { useState } from 'react';

const UnlockModal = ({ isOpen, onClose, onUnlock, logo, userCredits }) => {
  const [selectedTier, setSelectedTier] = useState('standard');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const spendingTiers = [
    {
      id: 'standard',
      name: 'Standard',
      credits: 10,
      description: 'High-quality logo for personal use',
      features: ['512x512 resolution', 'Standard format', 'Personal license']
    },
    {
      id: 'premium',
      name: 'Premium',
      credits: 20,
      description: 'Professional logo for business use',
      features: ['1024x1024 resolution', 'Multiple formats', 'Commercial license', 'Vector files']
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      credits: 35,
      description: 'Premium logo with full ownership',
      features: ['2048x2048 resolution', 'All formats', 'Full ownership', 'Priority support', 'Source files']
    }
  ];

  const handleUnlock = async () => {
    if (isUnlocking) return;
    
    const tier = spendingTiers.find(t => t.id === selectedTier);
    if (!tier) return;

    setIsUnlocking(true);
    try {
      await onUnlock({
        logoId: logo.imageId || logo.id,
        tier: tier.id,
        credits: tier.credits
      });
      onClose();
    } catch (error) {
      console.error('Unlock failed:', error);
    } finally {
      setIsUnlocking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Unlock Logo</h2>
              <p className="text-gray-600 mt-1">Choose your preferred quality tier</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logo Preview */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={logo.imageUrl}
                alt={logo.style}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{logo.style}</h3>
              <p className="text-gray-600 text-sm">{logo.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-500">Your balance:</span>
                <span className="text-sm font-semibold text-purple-600">{userCredits} credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Tiers */}
        <div className="p-6">
          <div className="space-y-4">
            {spendingTiers.map((tier) => {
              const canAfford = userCredits >= tier.credits;
              const isSelected = selectedTier === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canAfford && setSelectedTier(tier.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="tier"
                          value={tier.id}
                          checked={isSelected}
                          onChange={() => canAfford && setSelectedTier(tier.id)}
                          className="text-purple-600 focus:ring-purple-500"
                          disabled={!canAfford}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                        </div>
                      </div>
                      
                      <ul className="mt-3 space-y-1 ml-8">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-purple-600">{tier.credits}</div>
                      <div className="text-sm text-gray-500">credits</div>
                      {!canAfford && (
                        <div className="text-xs text-red-500 mt-1">
                          Need {tier.credits - userCredits} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Selected tier: <span className="font-semibold text-purple-600">
                {spendingTiers.find(t => t.id === selectedTier)?.name}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                disabled={isUnlocking || userCredits < (spendingTiers.find(t => t.id === selectedTier)?.credits || 0)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUnlocking ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock for {spendingTiers.find(t => t.id === selectedTier)?.credits} credits</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;
