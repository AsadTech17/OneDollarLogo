import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is OPPAL?",
      answer: "OPPAL is the Leviathan platform credit system. It is a unified digital currency used across multiple Leviathan-powered products and services."
    },
    {
      question: "How many credits does a logo cost?",
      answer: "Standard (10 OPPAL): 4x Low-res PNG/JPG logos. Premium (20 OPPAL): 4x High-res PNG/JPG logos (Transparent). Exclusive (35 OPPAL): 4x High-res PNG/JPG + Professional SVG (Vector) files."
    },
    {
      question: "Can I use my credits elsewhere?",
      answer: "Yes, credits are valid for use across the entire Leviathan platform ecosystem."
    },
    {
      question: "What is the Logo + Website Bundle?",
      answer: "Premium Logo Package + Automated Handoff to EasyStartupSites.com (45 OPPAL)."
    },
    {
      question: "Are credits refundable?",
      answer: "OPPAL credits are non-cash digital credits and are non-refundable once consumed."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about OPPAL credits
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-sm"
            >
              {/* Question */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <span className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-mono text-sm transition-all duration-300">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
