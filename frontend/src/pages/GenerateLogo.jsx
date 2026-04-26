import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";

const GenerateLogo = () => {
  const [businessIdea, setBusinessIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedLogos, setGeneratedLogos] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Rotating loading messages
  const loadingMessages = [
    "Analyzing your brand...",
    "Designing concepts...",
    "Finalizing logos..."
  ];

  // Update loading message with rotation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 2000);

      setLoadingMessage(loadingMessages[0]);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Check for existing generations on component mount
  useEffect(() => {
    const loadExistingGenerations = async () => {
      if (user) {
        console.log('🔍 Frontend: Loading existing generations for user:', user.uid);
        setIsLoadingExisting(true);
        
        try {
          const response = await api.get(`/api/generations/${user.uid}`);
          console.log('📥 Frontend: API response received:', response.data);
          
          if (response.data.success && response.data.data && response.data.data.logos && response.data.data.logos.length > 0) {
            console.log('✅ Frontend: Setting logos from existing generation:', response.data.data);
            setGeneratedLogos(response.data.data);
            setBusinessIdea(response.data.data.businessIdea || '');
          } else {
            // No existing generations, set empty state
            console.log('📝 Frontend: No existing generations found, setting empty state');
            setGeneratedLogos(null);
            setBusinessIdea('');
          }
        } catch (error) {
          console.error('💥 Frontend: Error loading existing generations:', error);
          // Don't show error to user, just set empty state
          setGeneratedLogos(null);
          setBusinessIdea('');
        } finally {
          setIsLoadingExisting(false);
        }
      } else {
        setIsLoadingExisting(false);
      }
    };

    loadExistingGenerations();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!businessIdea.trim() || businessIdea.trim().length < 10) {
      setError("Please provide at least 10 characters for your business idea.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedLogos(null);

    try {
      const response = await api.post('/api/generate', {
        businessIdea: businessIdea.trim()
      });

      if (response.data.success) {
        setGeneratedLogos(response.data.data);
        console.log('Generation completed with ID:', response.data.data.generationId);
      } else {
        setError(response.data.message || 'Failed to generate logos');
      }
    } catch (err) {
      console.error('Error generating logos:', err);
      setError(err.response?.data?.message || 'Failed to connect to the AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleStartNewProject = () => {
    setGeneratedLogos(null);
    setBusinessIdea("");
    setError(null);
  };

  return (
    <>
      <div className="min-h-screen bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
            >
              <span className="mr-2">{"<-"}</span>
              Back to Home
            </button>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI Logo Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Describe your business and our AI will create 4 unique logo
              concepts for you
            </p>
          </div>

          {/* Loading Existing Generations */}
          {isLoadingExisting && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                          🔄
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div
                        className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Loading your designs...
                  </h2>
                  <p className="text-gray-600">
                    Checking for existing logo concepts
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Input Form */}
          {!isLoading && !isLoadingExisting && !generatedLogos && (
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <div className="mb-6">
                  <label
                    htmlFor="businessIdea"
                    className="block text-gray-900 font-semibold mb-3"
                  >
                    Describe Your Business
                  </label>
                  <textarea
                    id="businessIdea"
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                    placeholder="Tell us about your business: What do you do? Who are your customers? What makes you unique? What's your brand personality?"
                    disabled={isLoading}
                  />
                  <div className="text-right mt-2">
                    <span className="text-gray-500 text-sm">
                      {businessIdea.length} characters
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {isLoading ? "Generating..." : "Generate Logos"}
                </button>
              </form>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                          AI
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div
                        className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {loadingMessage || 'Generating your logos...'}
                  </h2>
                  <div className="mt-8">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Logo Concepts
                </h2>
                <p className="text-gray-600 mb-6">
                  Brand: {generatedLogos.brandName} | Vibe: {generatedLogos.vibe}
                </p>
                <button
                  onClick={handleStartNewProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Generate New Concepts
                </button>
              </div>

              {/* Color Palette Display */}
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Brand Colors</h3>
                <div className="flex justify-center space-x-4">
                  {generatedLogos.colorPalette.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md border-2 border-white mb-2"
                        style={{ backgroundColor: color }}
                      ></div>
                      <p className="text-xs text-gray-600 font-mono">{color}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2x2 Logo Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {generatedLogos.logos.map((logo, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={logo.imageUrl}
                        alt={`${logo.style} logo concept`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSI1MTIiIHk9IjUxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIyNCI+SW1hZ2UgTG9hZGluZzwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-900 font-bold mb-2">{logo.style}</h3>
                      <p className="text-gray-700 text-sm mb-3">
                        {logo.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {logo.style.toLowerCase()}
                        </span>
                        <button
                          onClick={() => window.open(logo.imageUrl, '_blank')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GenerateLogo;
