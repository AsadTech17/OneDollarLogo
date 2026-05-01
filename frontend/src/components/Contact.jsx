import React from 'react';

const Contact = () => {
  return (
    <div className="w-full bg-white">
      <section 
        className="relative w-full h-[600px] md:h-[650px] flex items-center overflow-hidden bg-no-repeat bg-cover bg-center md:bg-contain md:bg-right"
        style={{ 
          // Style tag use karne se file name ke spaces ka masla khatam ho jata hai
          backgroundImage: "url('/1DollarLogo - Block 1 (Hero Banner) Contact Us Page.png')" 
        }}
      >
        {/* Mobile Overlay: Sirf mobile par halka sa white parda taake text readable ho */}
        <div className="absolute inset-0 bg-white/50 md:bg-transparent z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10 -mt-10 md:-mt-20">
          
          <div className="max-w-full md:max-w-[650px]">
            <h4 className="text-red-600 font-bold uppercase tracking-normal text-[30px] mb-4">
              CONTACT US
            </h4>
            
            <h1 className="text-[#0e1628] text-[32px] md:text-[60px] font-[900] leading-[1.1] mb-6 tracking-tighter">
              WE'RE HERE TO <br />
              <span className="text-red-600 uppercase">HELP YOU BUILD.</span>
            </h1>
            
            <p className="text-gray-700 md:text-gray-600 text-[15px] md:text-[18px] mb-10 max-w-lg leading-relaxed font-medium">
              Have a question, need support, or want to partner with us? <br className="hidden md:block" />
              Our team is ready to help you turn ideas into real brands.
            </p>

            {/* Feature Icons Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-bolt text-red-600 text-xl"></i>
                <div>
                  <h5 className="font-[800] text-[#0e1628] text-[15px]">Fast Response</h5>
                  <p className="text-gray-500 md:text-gray-400 text-[11px]">Usually within 24 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-[#0e1628] text-xl"></i>
                <div>
                  <h5 className="font-[800] text-[#0e1628] text-[15px]">Real Support</h5>
                  <p className="text-gray-500 md:text-gray-400 text-[11px]">From real people</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="fa-solid fa-bullseye text-[#0e1628] text-xl"></i>
                <div>
                  <h5 className="font-[800] text-[#0e1628] text-[15px]">Founder Focused</h5>
                  <p className="text-gray-500 md:text-gray-400 text-[11px]">We care about your brand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;