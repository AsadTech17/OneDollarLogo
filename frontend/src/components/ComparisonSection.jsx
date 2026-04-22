import { CheckCircle, XCircle, Sparkles, Target, Clock, Zap } from 'lucide-react';

const ComparisonSection = () => {
  const ourFeatures = [
    {
      icon: Sparkles,
      title: "Real AI Generation",
      description: "Creates truly unique designs from scratch"
    },
    {
      icon: Target,
      title: "Logo-Specific Training",
      description: "Trained specifically on professional logo design principles"
    },
    {
      icon: Zap,
      title: "Business Focus",
      description: "Understands brand identity and business needs"
    },
    {
      icon: Clock,
      title: "Generation Time",
      description: "Instant results in seconds, not hours"
    }
  ];

  const standardFeatures = [
    {
      icon: XCircle,
      title: "Template Mixing",
      description: "Combines existing templates without creativity"
    },
    {
      icon: XCircle,
      title: "General Purpose",
      description: "Not specialized for logo design"
    },
    {
      icon: XCircle,
      title: "Generic Approach",
      description: "Lacks understanding of brand identity"
    },
    {
      icon: XCircle,
      title: "Slow Processing",
      description: "Takes time and requires multiple iterations"
    }
  ];

  const statistics = [
    { number: "100%", label: "Original Designs" },
    { number: "0", label: "Templates Used" },
    { number: "∞", label: "Unique Possibilities" },
    { number: "1st", label: "Logo-Specific AI" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our <span className="relative">
              AI
              <span className="absolute bottom-0 left-0 w-8 h-1 bg-blue-600"></span>
            </span> Logo Generator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlike generic AI tools, we've built the first AI specifically designed for professional logo creation
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Our AI Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Our AI Logo Generator</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Built for Brands
              </span>
            </div>
            
            <div className="space-y-4">
              {ourFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standard AI Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Standard AI Tools</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                Generic Image Generation
              </span>
            </div>
            
            <div className="space-y-4">
              {standardFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-1xl md:text-2xl font-bold text-blue-600 mb-3">
                {stat.number}
              </div>
              <div className="text-gray-600 text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
