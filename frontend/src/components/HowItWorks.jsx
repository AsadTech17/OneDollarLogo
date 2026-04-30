import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HowItWorks.css'

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    navigate("/generate");
  };
  return (
    <section id="how-it-works" className="py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1d37] mb-2 leading-none">
            Build Your <span className="relative inline-block">Brand in</span> <span className="text-red-600">3 Steps</span>
          </h2>
        </div>

        {/* 3-Column Grid with Arrows */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-3">
          {/* Step 1 - FUND */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center flex flex-col items-center w-full max-w-[320px]">
            
            {/* Icon */}
            <div className="mb-0 -mt-8">
              <img
                src="/1DollarLogo - Block 3 (Icon 1) Home Page.png"
                alt="FUND"
                className="w-[170px] h-[170px] object-contain mx-auto"
              />
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-[#0a1d37] mb-1 -mt-3">FUND</h3>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed flex-grow">
              Buy OPPAL credits and choose the level of output you need.
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex items-center justify-center">
            <span className="text-3xl text-gray-400">→</span>
          </div>

          {/* Step 2 - CREATE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center flex flex-col items-center w-full max-w-[320px]">
            
            {/* Icon */}
            <div className="mb-0 -mt-8">
              <img
                src="/1DollarLogo - Block 3 (Icon 2) Home Page.png"
                alt="CREATE"
                className="w-[170px] h-[170px] object-contain mx-auto"
              />
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-[#0a1d37] mb-1 -mt-3">CREATE</h3>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed flex-grow">
              Describe your idea. Our AI interprets your business and generates brand-ready logo directions.
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex items-center justify-center">
            <span className="text-3xl text-gray-400">→</span>
          </div>

          {/* Step 3 - EXPORT */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center flex flex-col items-center w-full max-w-[320px]">            
            {/* Icon */}
            <div className="mb-0 -mt-8">
              <img
                src="/1DollarLogo - Block 3 (Icon 3) Home Page.png"
                alt="EXPORT"
                className="w-[170px] h-[170px] object-contain mx-auto"
              />
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-[#0a1d37] mb-1 -mt-3">EXPORT</h3>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed flex-grow">
              Pick your favorite, customize it, and download professional assets.
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-2 mb-0">
          <button onClick={handleGenerateClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg">
            Start With 10 OPPAL →
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks