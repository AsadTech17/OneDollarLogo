import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Purchase Credits",
      description: "Start by choosing a credit pack that fits your needs. 1DollarLogo uses the OPPAL economy, allowing you to unlock high-quality brand assets instantly.",
      image: "/buyimg.jpeg",
    },
    {
      id: 2,
      title: "Describe Your Vision",
      description: "Enter a single-field description of your business idea. Our AI 'Brain' interprets your niche and industry trends to create a unique Brand DNA.",
      image: "/Promptimg.jpeg",
    },
    {
      id: 3,
      title: "Generate & Export",
      description: "Our engine generates 4 unique logo variations. Select your favorite and export it instantly in professional formats like PNG, JPG, or high-res SVG.",
      image: "/EditorImg.jpeg",
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Image Header */}
              <div className="mb-6 w-full flex justify-center">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="h-32 object-contain rounded-xl"
                />
              </div>

              {/* Badge and Title */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                  {step.id}
                </span>
                <h3 className="text-xl font-bold text-gray-800">
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;