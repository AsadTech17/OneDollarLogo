const OfferTiers = () => {
  const tiers = [
    {
      title: "Standard",
      credits: "10 OPPAL",
      description: "Perfect for basic branding needs",
      features: [
        "4x Low-res PNG/JPG logos",
        "Basic customization options",
        "Commercial usage rights",
        "Email support"
      ],
      color: "bg-green-50 border-green-200",
      badgeColor: "bg-green-600"
    },
    {
      title: "Premium",
      credits: "20 OPPAL",
      description: "Ideal for professional use",
      features: [
        "4x High-res PNG/JPG logos (Transparent)",
        "Advanced customization",
        "Commercial usage rights",
        "Priority support"
      ],
      color: "bg-purple-50 border-purple-200",
      badgeColor: "bg-purple-600",
      popular: true
    },
    {
      title: "Exclusive",
      credits: "35 OPPAL",
      description: "For maximum flexibility",
      features: [
        "4x High-res PNG/JPG + Professional SVG (Vector) files",
        "Full customization options",
        "Commercial usage rights",
        "Priority support"
      ],
      color: "bg-yellow-50 border-yellow-200",
      badgeColor: "bg-yellow-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How to Spend Your Credits
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Use your OPPAL credits to unlock professional logo designs
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 ${
                tier.popular ? 'shadow-xl transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{tier.title[0]}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.title}</h3>
                
                {/* Credits */}
                <div className="mb-2">
                  <span className="text-3xl font-bold text-white">{tier.credits}</span>
                </div>
                
                <p className="text-blue-200 text-sm">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Use Credits
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Instant Delivery</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferTiers;
