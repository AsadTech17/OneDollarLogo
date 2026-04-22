import { Check, X, Star, Target, Eye, Zap } from 'lucide-react';

const FeaturesComparison = () => {
  const comparisonData = [
    {
      feature: 'Logo-Specific AI Training',
      ourAI: true,
      genericAI: false
    },
    {
      feature: '100% Original Generation',
      ourAI: true,
      genericAI: false
    },
    {
      feature: 'Visual Analysis Capability',
      ourAI: true,
      genericAI: false
    },
    {
      feature: 'Professional Branding Focus',
      ourAI: true,
      genericAI: false
    },
    {
      feature: 'Commercial-Ready Output',
      ourAI: true,
      genericAI: false
    },
    {
      feature: 'Template-Free Design',
      ourAI: true,
      genericAI: false
    },
    {
      feature: 'Fast Generation (2-3s)',
      ourAI: false,
      genericAI: true
    },
    {
      feature: 'General Image Creation',
      ourAI: false,
      genericAI: true
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features Comparison
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how our specialized AI logo generator compares to generic AI tools. We've built the first AI specifically designed for professional logo creation.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header Row */}
          <div className="bg-blue-600 text-white">
            <div className="grid grid-cols-3 divide-x divide-blue-700">
              <div className="px-6 py-4 font-semibold text-center">
                Feature
              </div>
              <div className="px-6 py-4 font-semibold text-center">
                Our AI Logo Generator
              </div>
              <div className="px-6 py-4 font-semibold text-center">
                Generic AI Tools
              </div>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-gray-200">
            {comparisonData.map((item, index) => (
              <div key={index} className="grid grid-cols-3 divide-x divide-gray-200">
                <div className="px-6 py-4 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{item.feature}</span>
                  </div>
                </div>
                
                <div className="px-6 py-4 flex items-center justify-center">
                  {item.ourAI ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 flex items-center justify-center">
                  {item.genericAI ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Our AI Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Our AI Logo Generator</h3>
            </div>
            <p className="text-gray-600">
              Specialized logo generation with professional branding focus and commercial-ready output.
            </p>
          </div>

          {/* Others Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Generic AI Tools</h3>
            </div>
            <p className="text-gray-600">
              General-purpose image creation with faster speeds but less specialized for professional logos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesComparison;
