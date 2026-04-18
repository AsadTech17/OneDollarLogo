import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerateLogo = () => {
  const [businessIdea, setBusinessIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!businessIdea.trim() || businessIdea.trim().length < 10) {
      setError('Please describe your business in at least 10 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedLogos(null);

    try {
      const response = await fetch('http://localhost:5000/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessIdea: businessIdea.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedLogos(result.data);
      } else {
        setError(result.message || 'Failed to generate logos');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to connect to the logo generation service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedLogos(null);
    handleSubmit(new Event('submit'));
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors duration-200"
          >
            <span className="mr-2">{'<-'}</span>
            Back to Home
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Logo Generator
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Describe your business and our AI will create 4 unique logo concepts for you
          </p>
        </div>

        {/* Input Form */}
        {!isLoading && !generatedLogos && (
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="mb-6">
                <label htmlFor="businessIdea" className="block text-white font-semibold mb-3">
                  Describe Your Business
                </label>
                <textarea
                  id="businessIdea"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder="Tell us about your business: What do you do? Who are your customers? What makes you unique? What's your brand personality?"
                  disabled={isLoading}
                />
                <div className="text-right mt-2">
                  <span className="text-blue-200 text-sm">
                    {businessIdea.length} characters
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || businessIdea.trim().length < 10}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:from-blue-800 focus:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 disabled:transform-none focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Generate Logos
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
              <div className="text-center">
                {/* AI Thinking Animation */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        AI
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  AI is thinking...
                </h2>
                <p className="text-blue-200 mb-2">
                  Analyzing your business concept
                </p>
                <p className="text-blue-200 mb-2">
                  Generating brand DNA with Gemini AI
                </p>
                <p className="text-blue-200">
                  Creating 4 unique logo variations
                </p>

                <div className="mt-8">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {generatedLogos && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Your Logo Concepts
              </h2>
              <p className="text-blue-200 mb-6">
                Based on: "{generatedLogos.businessIdea}"
              </p>
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Generate New Concepts
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedLogos.logos.map((logo, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300">
                  {/* Logo Image */}
                  <div className="relative aspect-square bg-white/5">
                    <img
                      src={logo.imageUrl}
                      alt={`${logo.style} logo concept`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${logo.imageId}/512/512`;
                      }}
                    />
                    
                    {/* Watermark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                          <p className="text-white text-xs font-semibold">OneDollarLogo</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo Details */}
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2">{logo.style}</h3>
                    <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                      {logo.description}
                    </p>
                    
                    {/* Color Palette */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-blue-300 text-xs">Colors:</span>
                      <div className="flex space-x-1">
                        {logo.colors.slice(0, 3).map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-4 h-4 rounded-full border border-white/30"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="mb-4">
                      <span className="text-blue-300 text-xs">Typography: </span>
                      <span className="text-blue-200 text-xs">{logo.typography}</span>
                    </div>

                    {/* Brand Values */}
                    <div className="flex flex-wrap gap-1">
                      {logo.values.slice(0, 2).map((value, valueIndex) => (
                        <span
                          key={valueIndex}
                          className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Love Your Logo?
                </h3>
                <p className="text-blue-200 mb-6">
                  Get high-resolution files and unlimited revisions with our premium packages
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:from-blue-800 focus:to-purple-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                  View Pricing Packages
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateLogo;
