import React from 'react'

const OfferTiers = () => {
  return (
    <section className="pt-0 pb-0 bg-white">
      <div className="flex flex-col items-center justify-between max-w-7xl mx-auto px-6 pt-5 gap-0 md:flex-row md:items-center md:justify-between md:gap-8">
          
          {/* Left Side - Credit System Image */}
          <div className="w-full md:w-[45%] h-96 mt-0 md:mt-0 -mb-[195px] md:mb-0">
            <img 
              src="/1DollarLogo - Block 7 (Left) Home Page.png"
              alt="Credit System"
              className="w-full h-full object-contain object-top"
            />
          </div>
          
                    
          {/* Right Side - Heading and Comparison Image */}
          <div className="flex-1 w-full -mt-[40px] md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center md:text-left mt-0 pt-0">
              Built for Brands. <span className="text-white">Not Generic Images.</span>
            </h2>
            
            <img 
              src="/1DollarLogo - Block 7 (Right) Home Page.png"
              alt="Feature Comparison Table"
              className="w-full h-96 rounded-xl object-contain object-top -mt-12"
            />
          </div>
          
        </div>
    </section>
  )
}

export default OfferTiers