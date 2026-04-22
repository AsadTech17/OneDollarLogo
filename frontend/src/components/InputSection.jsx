const InputSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Logo Design
          </h2>
          <p className="text-lg text-gray-600">
            Describe your brand and let our AI create the perfect logo for you
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="brand-name" className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                id="brand-name"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your brand name"
              />
            </div>
            
            <div>
              <label htmlFor="brand-description" className="block text-sm font-medium text-gray-700 mb-2">
                Brand Description
              </label>
              <textarea
                id="brand-description"
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                placeholder="Describe your brand, values, and what makes you unique..."
              />
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                id="industry"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select your industry</option>
                <option value="technology">Technology</option>
                <option value="food">Food & Beverage</option>
                <option value="fashion">Fashion</option>
                <option value="health">Health & Wellness</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Generate Logo Ideas
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              One-click generation with AI-powered design
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputSection;
