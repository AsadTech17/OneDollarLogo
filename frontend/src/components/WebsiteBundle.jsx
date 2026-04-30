import React from "react";

const WebsiteBundle = () => {
  return (
    <section className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dark Horizontal Banner */}
        <div className="bg-[#0a192f] rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Text Section */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Launch Your Logo + Website{" "}
                <span className="text-red-600">Instantly</span>
              </h3>
              <p className="text-white text-sm md:text-base max-w-lg">
                Create your logo, then send your brand directly into
                EasyStartupSites.com for a fast website build.
              </p>
            </div>

            {/* Center Icons & Process */}
            <div className="flex items-center justify-center gap-4 md:gap-6">
              {/* Icon 1: 1DollarLogo */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden mb-2 p-[1px]">
                  <img
                    src="/1DollarLogo - Block 6 (Icon 1) Home Page.png"
                    alt="1DollarLogo"
                    className="w-full h-full object-cover object-center scale-[1.75]"
                  />
                </div>
                <span className="text-sm text-white font-medium">
                  1DollarLogo
                </span>
              </div>

              {/* Arrow 1 */}
              <div className="text-white mb-6">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* Icon 2: EasyStartupSites */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden mb-2 p-[4px]">
                  <img
                    src="/1DollarLogo - Block 6 (Icon 2) Home Page.png"
                    alt="EasyStartupSites"
                    className="w-full h-full object-cover object-center scale-[1.75]"
                  />
                </div>
                <span className="text-sm text-white font-medium">
                  EasyStartupSites
                </span>
              </div>

              {/* Arrow 2 */}
              <div className="text-white mb-6">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* Icon 3: Support */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden mb-2 p-[4px]">
                  <img
                    src="/1DollarLogo - Block 6 (Icon 3) Home Page.png"
                    alt="Support"
                    className="w-full h-full object-cover object-center scale-[1.75]"
                  />
                </div>
                <span className="text-sm text-white font-medium">Support</span>
              </div>
            </div>

            {/* Right Pricing Section */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                <div className="text-sm text-white mb-1">
                  Logo + Website Bundle
                </div>
                <div className="text-5xl font-bold text-green-500 mb-1">45</div>
                <div className="text-sm text-green-400 font-semibold">
                  OPPAL
                </div>
              </div>

              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                Launch My Brand
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteBundle;
