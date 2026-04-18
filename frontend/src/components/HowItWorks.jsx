import { Zap, Palette, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Zap,
      title: "Describe Your Vision",
      description: "Tell us about your brand, values, and what makes your business unique. Our AI understands your needs.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Palette,
      title: "AI Generates Designs",
      description: "Get multiple professional logo concepts instantly, tailored to your industry and preferences.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Download,
      title: "Customize & Launch",
      description: "Fine-tune your favorite design and download in all formats. Ready for web, print, and social media.",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your professional logo in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Step Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${step.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose 1DollarLogo?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "AI-Powered", desc: "Smart algorithms create unique designs" },
              { title: "Professional Quality", desc: "Studio-grade logos every time" },
              { title: "Instant Delivery", desc: "Get your logo in minutes, not days" },
              { title: "Full Rights", desc: "Complete commercial usage rights" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 bg-purple-600 rounded"></div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
