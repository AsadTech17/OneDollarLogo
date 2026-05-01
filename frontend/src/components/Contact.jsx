import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full bg-white">

      {/* ── BLOCK 1: HERO ── (already built, keeping as-is) */}
      <section
        className="relative w-full h-[600px] md:h-[650px] flex items-center overflow-hidden bg-no-repeat bg-cover bg-center md:bg-contain md:bg-right"
        style={{
          backgroundImage: "url('/1DollarLogo - Block 1 (Hero Banner) Contact Us Page.png')"
        }}
      >
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

      {/* ── BLOCK 2: CONTACT INFO + MESSAGE FORM ── */}
      <section className="w-full py-0 px-4 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left: Contact Information Card */}
          <div className="bg-[#0e1628] rounded-2xl p-8 text-white flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>

            {/* Email */}
            <div>
              <div className="flex items-start gap-4">
                <div className="bg-red-600 rounded-xl p-3 flex-shrink-0">
                  <i className="fa-solid fa-envelope text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">Email</h4>
                  <p className="text-white text-[14px]">support@1dollarlogo.com</p>
                  <p className="text-white text-[12px]">We reply within 24 hours</p>
                </div>
              </div>
              <hr className="border-gray-600 mt-6" />
            </div>

            {/* Office */}
            <div>
              <div className="flex items-start gap-4">
                <div className="bg-red-600 rounded-xl p-3 flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">Office</h4>
                  <p className="text-white text-[14px]">San Francisco, CA 94102</p>
                  <p className="text-white text-[12px]">United States</p>
                </div>
              </div>
              <hr className="border-gray-600 mt-6" />
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-start gap-4">
                <div className="bg-red-600 rounded-xl p-3 flex-shrink-0">
                  <i className="fa-solid fa-phone text-white text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">Phone</h4>
                  <p className="text-white text-[14px]">+1 (555) 123-4567</p>
                  <p className="text-white text-[12px]">Mon - Fri, 9:00 AM - 6:00 PM PT</p>
                </div>
              </div>
              <hr className="border-gray-600 mt-6" />
            </div>

            {/* Follow Us */}
            <div className="flex items-start gap-4">
              <div className="bg-red-600 rounded-xl p-3 flex-shrink-0">
                <i className="fa-solid fa-globe text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-bold text-white text-[15px] mb-3">Follow Us</h4>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-white hover:text-red-400 transition-colors">
                    <i className="fa-brands fa-twitter text-2xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-red-400 transition-colors">
                    <i className="fa-brands fa-linkedin text-2xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-red-400 transition-colors">
                    <i className="fa-brands fa-instagram text-2xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Send Message Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0e1628] mb-6">Send us a Message</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 mb-2">
                  <i className="fa-regular fa-user text-gray-400"></i> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 mb-2">
                  <i className="fa-regular fa-envelope text-gray-400"></i> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 mb-2">
                <i className="fa-regular fa-comment text-gray-400"></i> Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 focus:outline-none focus:border-red-500 transition-colors appearance-none"
              >
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 mb-2">
                <i className="fa-regular fa-message text-gray-400"></i> Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                rows={5}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 text-[16px]"
            >
              Send Message
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ── BLOCK 3: FAQ BANNER ── */}
      <section className="w-full px-4 md:px-10 py-8 bg-white">
        <div className="max-w-7xl mx-auto border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-[#0e1628] font-bold text-[18px] md:text-[20px]">Looking for quick answers?</h3>
              <p className="text-gray-500 text-[13px] md:text-[14px]">Check out our FAQ for instant answers to common questions.</p>
            </div>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 border-2 border-[#0e1628] text-[#0e1628] hover:bg-[#0e1628] hover:text-white transition-colors font-bold px-6 py-3 rounded-lg text-[14px] whitespace-nowrap"
            >
              Visit FAQ <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          {/* FAQ Category Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-red-400 transition-colors cursor-pointer">
              <i className="fa-solid fa-layer-group text-green-600 text-xl"></i>
              <span className="text-[13px] font-semibold text-[#0e1628]">How OPPAL credits work</span>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-red-400 transition-colors cursor-pointer">
              <i className="fa-solid fa-tag text-red-500 text-xl"></i>
              <span className="text-[13px] font-semibold text-[#0e1628]">Logo pricing & packages</span>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-red-400 transition-colors cursor-pointer">
              <i className="fa-solid fa-desktop text-blue-600 text-xl"></i>
              <span className="text-[13px] font-semibold text-[#0e1628]">Logo + Website Bundle</span>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-red-400 transition-colors cursor-pointer">
              <i className="fa-solid fa-circle-user text-[#0e1628] text-xl"></i>
              <span className="text-[13px] font-semibold text-[#0e1628]">Account & billing</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOCK 4: PARTNER BANNER ── */}
      <section className="w-full px-4 md:px-10 py-8 bg-white">
        <div className="max-w-7xl mx-auto bg-[#0e1628] rounded-2xl px-8 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-[20px] md:text-[22px] mb-1">Want to partner with us?</h3>
            <p className="text-gray-400 text-[14px]">We're always open to working with founders, creators, agencies, and platforms.</p>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <a
              href="#"
              className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#0e1628] transition-colors font-bold px-6 py-3 rounded-xl text-[14px] whitespace-nowrap"
            >
              Let's Connect <i className="fa-solid fa-arrow-right"></i>
            </a>
            {/* Handshake SVG Icon */}
            <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block flex-shrink-0">
              {/* Left hand - red */}
              <path d="M5 30 C5 20 15 15 22 18 L35 28" stroke="#e11d48" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <path d="M5 30 C5 40 15 45 22 42 L35 32" stroke="#e11d48" strokeWidth="5" strokeLinecap="round" fill="none"/>
              {/* Right hand - blue */}
              <path d="M65 30 C65 20 55 15 48 18 L35 28" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <path d="M65 30 C65 40 55 45 48 42 L35 32" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" fill="none"/>
              {/* Clasp */}
              <circle cx="35" cy="30" r="5" fill="white" opacity="0.9"/>
            </svg>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;