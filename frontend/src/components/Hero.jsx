import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    navigate("/generate");
  };

  return (
    <>
      <section
        id="home"
        className="bg-gradient-to-br from-gray-50 to-gray-100 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Cat Logo */}
            <div className="mb-8 flex justify-center">
              <img
                src="/1DollarlogoCat.png"
                alt="1 Dollar Logo Cat"
                className="h-32 w-auto object-contain"
              />
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              AI Logo Generator
              <span className="block w-24 h-[4px] bg-blue-600 mt-2 mx-auto rounded-full"></span>
            </h1>

            {/* Description Text */}
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              First AI logo creator without templates - powered by OpenAI, trained for unique, original design.
            </p>

            {/* Generate Button */}
            <button
              onClick={handleGenerateClick}
              className="inline-block bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 shadow-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Generate
            </button>

            {/* Rating Section */}
            <div className="mt-12 flex items-center justify-center space-x-2">
              {/* 5 Yellow Stars */}
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-yellow-400 fill-current"
                  />
                ))}
              </div>
              
              {/* Rating Text */}
              <span className="text-gray-600 font-medium ml-2">
                4.7
              </span>
              
              {/* Quality Score */}
              <span className="text-gray-500 text-sm ml-1">
                Image quality score
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
