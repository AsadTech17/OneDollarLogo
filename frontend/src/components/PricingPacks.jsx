import { Check, Star, Zap } from 'lucide-react';

const PricingPacks = () => {
  const plans = [
    {
      name: "Basic",
      price: "$1",
      description: "Perfect for startups and small businesses",
      features: [
        "3 AI-generated logo concepts",
        "Basic customization options",
        "PNG & JPG downloads",
        "Commercial usage rights",
        "Email support"
      ],
      color: "border-gray-300",
      badge: null,
      popular: false
    },
    {
      name: "Professional",
      price: "$5",
      description: "Ideal for growing businesses",
      features: [
        "10 AI-generated logo concepts",
        "Advanced customization",
        "All file formats (SVG, PNG, JPG)",
        "Brand guidelines document",
        "Priority support",
        "Social media kit"
      ],
      color: "border-purple-600",
      badge: "Most Popular",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$9",
      description: "For established brands and agencies",
      features: [
        "Unlimited logo concepts",
        "Full design customization",
        "Vector files & source files",
        "Complete brand identity kit",
        "24/7 dedicated support",
        "Multiple revisions",
        "Team collaboration tools"
      ],
      color: "border-gray-300",
      badge: null,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional logos at prices that make sense for your business
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} ${
                plan.popular ? 'shadow-xl transform scale-105' : 'shadow-lg'
              } transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/logo</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.popular ? 'Get Started Now' : 'Choose Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            100% Satisfaction Guarantee
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Not happy with your logo? We'll work with you until you love it, or your money back. 
            No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPacks;
