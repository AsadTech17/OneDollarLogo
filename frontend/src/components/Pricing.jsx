const Pricing = () => {
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
        "Email support"
      ],
      color: "border-blue-600",
      badge: null,
      popular: false
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
        "Priority support"
      ],
      color: "border-purple-600",
      badge: "MOST POPULAR",
      popular: true
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
        "Priority support"
      ],
      color: "border-purple-600",
      badge: null,
      popular: false
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
        "Dedicated account manager"
      ],
      color: "border-gray-600",
      badge: null,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            OPPAL Credit Packs
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Purchase credits to unlock professional logo designs
          </p>
        </div>

        {/* Credit Packs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-white/10 backdrop-blur-sm border-2 ${pack.color} ${
                pack.popular ? 'shadow-xl transform scale-105' : 'shadow-lg'
              } transition-all duration-300 hover:shadow-2xl rounded-2xl`}
            >
              {/* Popular Badge */}
              {pack.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <span className="text-sm font-semibold">{pack.badge}</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Pack Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-white">{pack.price}</span>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-1 mb-2">
                    <span className="text-blue-200 font-semibold">{pack.credits}</span>
                  </div>
                  <p className="text-blue-100 text-sm">{pack.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {pack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                    pack.popular
                      ? 'bg-purple-600 hover:bg-purple-700 focus:bg-purple-800 text-white'
                      : 'bg-white/20 hover:bg-white/30 focus:bg-white/40 text-white'
                  }`}
                >
                  Purchase Pack
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-[11px] max-w-3xl mx-auto">
            OPPAL credits are non-cash digital credits and are non-refundable once consumed. Credits are valid for use across the Leviathan platform ecosystem.
          </p>
        </div>

        {/* Credits Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            How OPPAL Credits Work
          </h3>
          <p className="text-blue-200 max-w-2xl mx-auto mb-6">
            Purchase credit packs and use them to unlock professional logo designs. 
            Credits never expire and can be used across the Leviathan platform.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-2">10</div>
              <div className="text-blue-200 text-sm">Standard Logo</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-2">20</div>
              <div className="text-blue-200 text-sm">Premium Logo</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-2">35</div>
              <div className="text-blue-200 text-sm">Exclusive Logo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
