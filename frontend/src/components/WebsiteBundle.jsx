const WebsiteBundle = () => {
  const bundleFeatures = [
    "Premium Logo Package (20 OPPAL value)",
    "Automated Handoff to EasyStartupSites.com",
    "Brand pre-loaded and ready to customize",
    "Professional website templates",
    "Mobile-responsive design",
    "Basic SEO setup included",
    "24/7 support for both services"
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upsell Card */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-xl opacity-50"></div>
          
          {/* Card with Gradient Border */}
          <div className="relative bg-slate-900 rounded-2xl p-1">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-2xl p-0.5">
              <div className="bg-slate-900 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mr-3">
                        SPECIAL BUNDLE
                      </div>
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        SAVE 25%
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Logo + Website Bundle
                    </h3>
                    
                    <p className="text-xl text-blue-200 mb-6">
                      Premium Logo Package + Automated Handoff to EasyStartupSites.com
                    </p>

                    {/* Key Features */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-blue-100">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span>Premium Logo Package (20 OPPAL value)</span>
                      </div>
                      <div className="flex items-center text-blue-100">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span>Automated Handoff to EasyStartupSites.com</span>
                      </div>
                      <div className="flex items-center text-blue-100">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span>Brand pre-loaded and ready to customize</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Content - Price & CTA */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <div className="text-5xl font-bold text-white mb-2">45</div>
                      <div className="text-xl text-orange-400 font-semibold">OPPAL</div>
                    </div>
                    
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                      Get the Bundle
                    </button>
                    
                    <p className="text-blue-200 text-sm mt-3">
                      Instant setup with automated handoff
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteBundle;
