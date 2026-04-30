import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#010816] text-white py-6 px-4 md:px-10 border-t border-gray-800 z-10">
      {/* FontAwesome CDN for Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Left Side: Brand Logo and Tagline */}
        <div className="flex flex-col gap-2">
          <img 
            src="/1DollarLogo - Icon (Logo Trans) .png" 
            alt="1DollarLogo" 
            className="w-28 object-contain"
          />
          <p className="text-white text-[11px] max-w-[220px] leading-tight">
            Affordable brand identity for founders, creators, and small businesses.
          </p>
        </div>

        {/* Middle: Links Sections (Exactly as requested) */}
        <div className="flex gap-10 lg:gap-16">
          {/* Product Section */}
          <div>
            <h4 className="font-bold text-[12px] mb-3 tracking-wider uppercase">Product</h4>
            <ul className="text-white text-[11px] space-y-1.5">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">How It Works</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Examples</li>
              <li className="hover:text-white cursor-pointer">OPPAL Credits</li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-bold text-[12px] mb-3 tracking-wider uppercase">Company</h4>
            <ul className="text-white text-[11px] space-y-1.5">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold text-[12px] mb-3 tracking-wider uppercase">Support</h4>
            <ul className="text-white text-[11px] space-y-1.5">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
              <li className="hover:text-white cursor-pointer">Privacy</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Stay Connected */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[12px] tracking-wider uppercase">Stay Connected</h4>
          <div className="flex gap-5 text-lg text-white">
            <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;