import { Link } from 'react-router-dom';

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How to Spend Your Credits
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use your OPPAL credits to unlock professional logo designs
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 ${
                tier.popular ? 'shadow-xl transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">{tier.title[0]}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.title}</h3>
                
                {/* Credits */}
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">{tier.credits}</span>
                </div>
                
                <p className="text-gray-600 text-sm">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-green-100 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link 
                to="/generate" 
                state={{ plan: tier.title.toLowerCase() }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block text-center"
              >
                Use Credits
              </Link>
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
