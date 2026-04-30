import React from 'react'

const ComparisonSection = () => {
  return (
    <section className="py-3 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Text */}
          <div className="md:w-1/3 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1d37] mb-2 leading-tight">
              Not a Logo Maker.
            </h2>
            <h3 className="text-1xl md:text-2xl font-bold text-red-600 mb-3 leading-tight">
              A Brand Creation Engine.
            </h3>
            <p className="text-md text-gray-600 leading-relaxed max-w-sm mb-3">
              1DollarLogo helps founders go from raw idea to real identity using Ai trained for brand logic, visual direction, and business-ready output.
            </p>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="md:w-2/3 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Card 1 - Brand Intelligence */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center">
                  <img
                    src="/1DollarLogo - Block 2 (Icon 1) Home Page.png"
                    alt="Brand Intelligence"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <h4 className="text-lg font-semibold text-[#0a1d37] mb-2 mt-0 text-center">
                  Brand Intelligence
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  Understands your business, audience, niche, and visual direction.
                </p>
              </div>

              {/* Card 2 - Original Output */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center">
                  <img
                    src="/1DollarLogo - Block 2 (Icon 2) Home Page.png"
                    alt="Original Output"
                    className="w-20 h-20 object-contain mx-auto"
                  />
                </div>
                <h4 className="text-lg font-semibold text-[#0a1d37] mb-2 mt-0 text-center">
                  Original Output
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  No templates. No remixing. Fresh concepts generated from your prompt.
                </p>
              </div>

              {/* Card 3 - Export-Ready Assets */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center">
                  <img
                    src="/1DollarLogo - Block 2 (Icon 3) Home Page.png"
                    alt="Export-Ready Assets"
                    className="w-20 h-20 object-contain mx-auto"
                  />
                </div>
                <h4 className="text-lg font-semibold text-[#0a1d37] mb-2 mt-0 text-center">
                  Export-Ready Assets
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  Download logo files for web, social, print, and brand launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection