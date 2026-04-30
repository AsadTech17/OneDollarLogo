import React from 'react';

const VisualDivider = () => {
  return (
    <section className="bg-white p-0 m-0 overflow-hidden -mt-40 md:-mt-20">
      <div className="w-full">
        <a href="/generate" className="relative cursor-pointer transition-transform duration-300 hover:scale-[1.01] block">
          <img 
            src="/1DollarLogo - Block 8 (CTA Banner) Home Page.png" 
            alt="Ready to build your brand" 
            className="w-full h-auto display-block mb-7 md:mb-0"
          />
        </a>
      </div>
      <div className="h-2 bg-[#010816] -mt-11" />
    </section>
  );
};

export default VisualDivider;