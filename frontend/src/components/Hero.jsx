import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight, Zap, Target, Shield } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    navigate("/generate");
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-[750px] bg-white overflow-hidden md:-mt-[120px]"
      >
        {/* Background Image - Hidden on Mobile */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <img
            src="/1DollarLogo - Block 1 (Hero Banner) Home Page.png"
            alt="1 Dollar Logo Hero Banner"
            className="w-full h-full object-contain object-right"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Mobile Layout - Hidden on Desktop */}
          <div className="block md:hidden">
            <div className="min-h-[750px] flex flex-col justify-between py-12">
              {/* Text Section */}
              <div className="flex flex-col items-center text-center px-4">
                {/* Main Headline */}
                <h1 className="text-3xl font-bold text-[#0a1d37] mb-6 leading-none">
                  FROM IDEA TO IDENTITY.{" "}
                  <span className="text-red-600">IN MINUTES.</span>
                </h1>

                {/* Sub-heading */}
                <p className="text-sm text-gray-900 mb-8 leading-relaxed max-w-md">
                  AI-powered brand creation built to generate logos, identity assets, and launch-ready visuals without templates.
                </p>
              </div>

              {/* Image Section */}
              <div className="flex justify-center items-center my-4">
                <img
                  src="/1DollarLogo - Block 1 (Hero Banner) Home Page.png"
                  alt="1 Dollar Logo Hero Banner"
                  className="w-[200px] h-auto object-contain mx-auto"
                />
              </div>

              {/* Button Section */}
              <div className="flex flex-col items-center w-full space-y-3 px-4">
                {/* Start Creating Button */}
                <button
                  onClick={handleGenerateClick}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span>Start Creating</span>
                  <ArrowRight size={16} className="text-white" />
                </button>

                {/* View Examples Button */}
                <button
                  className="bg-white hover:bg-gray-50 text-blue-900 font-bold py-3 px-6 rounded-full border-2 border-blue-900 transition-all duration-200 transform hover:scale-105"
                >
                  View Examples
                </button>
              </div>

              {/* Features Bar */}
              <div className="bg-gray-900 py-6 px-4 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Feature 1 */}
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-white text-sm font-medium">
                      4.7 Image Quality Score
                    </span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="text-red-500" size={16} />
                    <span className="text-white text-sm font-medium">
                      Instant Generation
                    </span>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="text-red-500" size={16} />
                    <span className="text-white text-sm font-medium">
                      Brand-Trained AI
                    </span>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="text-red-500" size={16} />
                    <span className="text-white text-sm font-medium">
                      Commercial-Ready Output
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Hidden on Mobile */}
          <div className="hidden md:block">
            <div className="min-h-[750px] flex flex-col justify-between py-12">
              {/* Main Content - Left Side */}
              <div className="max-w-2xl pl-10 pt-16">
                {/* Main Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0a1d37] mb-6 leading-none">
                  FROM IDEA TO IDENTITY.{" "}
                  <span className="text-red-600">IN MINUTES.</span>
                </h1>

                {/* Sub-heading */}
                <p className="text-md text-gray-900 mb-8 leading-relaxed max-w-md">
                  AI-powered brand creation built to generate logos, identity assets, and launch-ready visuals without templates.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Start Creating Button */}
                  <button
                    onClick={handleGenerateClick}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <span>Start Creating</span>
                    <ArrowRight size={16} className="text-white" />
                  </button>

                  {/* View Examples Button */}
                  <button
                    className="bg-white hover:bg-gray-50 text-blue-900 font-bold py-3 px-6 rounded-full border-2 border-blue-900 transition-all duration-200 transform hover:scale-105"
                  >
                    View Examples
                  </button>
                </div>
              </div>

              {/* Bottom Features Bar */}
              <div className="bg-gray-900 py-6 px-10 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Feature 1 */}
                  <div className="flex items-center space-x-2 border-r border-gray-700 pr-4 last:border-r-0">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-white text-sm font-medium">
                      4.7 Image Quality Score
                    </span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center space-x-2 border-r border-gray-700 pr-4 last:border-r-0">
                    <Zap className="text-red-500" size={16} />
                    <span className="text-white text-sm font-medium">
                      Instant Generation
                    </span>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center space-x-2 border-r border-gray-700 pr-4 last:border-r-0">
                    <Target className="text-red-500" size={16} />
                    <span className="text-white text-sm font-medium">
                      Brand-Trained AI
                    </span>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-center space-x-2">
                    <Shield className="text-red-500" size={16} />
                    <span className="text-white text-sm font-medium">
                      Commercial-Ready Output
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
