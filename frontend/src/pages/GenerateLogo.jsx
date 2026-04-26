import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Unlock, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const GenerateLogo = () => {
  const [businessIdea, setBusinessIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedLogos, setGeneratedLogos] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [downloadingLogo, setDownloadingLogo] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedTier, setSelectedTier] = useState('Standard');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedLogos, setUnlockedLogos] = useState(new Set()); // Tracks generationId_index combinations
  const [currentGenerationId, setCurrentGenerationId] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Tier costs
  const tierCosts = {
    Standard: 10,
    Premium: 20,
    Exclusive: 35
  };
  
  // Fetch user credits (same as Navbar)
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return;
      
      setIsCreditsLoading(true);
      
      try {
        const response = await api.get('/api/credits/balance');
        
        if (response.data.success) {
          setUserCredits(response.data.data?.credits || 0);
          console.log('💰 Credits fetched:', response.data.data?.credits);
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
        setUserCredits(0);
      } finally {
        setIsCreditsLoading(false);
      }
    };

    if (user) {
      fetchUserCredits();
    } else {
      setIsCreditsLoading(false);
    }
  }, [user]);

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

  // Check for existing generations and unlocks on component mount
  useEffect(() => {
    const loadExistingGenerations = async () => {
      if (user) {
        console.log('🔍 Frontend: Loading existing generations for user:', user.uid);
        setIsLoadingExisting(true); // Set loading state to true
        
        // Clear unlocked logos before loading new results
        setUnlockedLogos(new Set());
        setCurrentGenerationId(null);
        
        try {
          const response = await api.get(`/api/generations/${user.uid}`);
          console.log('📥 Frontend: API response received:', response.data);
          
          // Check for success, data, and if there are actual logos
          if (response.data.success && response.data.data && response.data.data.logos && response.data.data.logos.length > 0) {
            console.log('✅ Frontend: Setting logos from existing generation:', response.data.data);
            setGeneratedLogos(response.data.data);
            setBusinessIdea(response.data.data.businessIdea || '');
            setCurrentGenerationId(response.data.data.generationId);
            
            // Load existing unlocks for this user
            if (user.uid && response.data.data.generationId) {
              try {
                const unlocksResponse = await api.get(`/api/unlocks/${user.uid}`);
                if (unlocksResponse.data.success && unlocksResponse.data.unlocks) {
                  // Filter unlocks for current generation only and create generationId_index combinations
                  const currentGenerationUnlocks = unlocksResponse.data.unlocks.filter(
                    u => u.generationId === response.data.data.generationId
                  );
                  const unlockedCombinations = new Set(
                    currentGenerationUnlocks.map(u => `${u.generationId}_${u.logoIndex}`)
                  );
                  setUnlockedLogos(unlockedCombinations);
                  console.log('🔓 Loaded existing unlocks for current generation:', unlockedCombinations);
                }
              } catch (unlockError) {
                console.log('📝 No existing unlocks found or error loading unlocks');
              }
            }
          } else {
            // No existing generations, set empty state
            console.log('📝 Frontend: No existing generations found, setting empty state');
            setGeneratedLogos(null);
            setBusinessIdea('');
            setCurrentGenerationId(null);
          }
        } catch (error) {
          console.error('💥 Frontend: Error loading existing generations:', error);
          // Don't show error to user, just set empty state
          setGeneratedLogos(null);
          setBusinessIdea('');
          setCurrentGenerationId(null);
        } finally {
          setIsLoadingExisting(false); // Always set loading state to false
        }
      } else {
        setIsLoadingExisting(false); // If no user, stop loading existing
        setUnlockedLogos(new Set());
        setCurrentGenerationId(null);
      }
    };

    loadExistingGenerations();
  }, [user]); // Rerun when user object changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      // Redirect to login page for non-authenticated users
      navigate('/login');
      return;
    }
    
    // Validate input
    if (!businessIdea.trim()) {
      setError('Please describe your business idea');
      return;
    }
    
    if (businessIdea.trim().length < 10) {
      setError('Please provide at least 10 characters for your business idea');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const response = await api.post('/api/generate', {
        businessIdea: businessIdea.trim()
      });

      if (response.data.success) {
        // Reset unlocked logos for new generation
        setUnlockedLogos(new Set());
        setCurrentGenerationId(response.data.data.generationId);
        setGeneratedLogos(response.data.data);
        console.log('Generation completed with ID:', response.data.data.generationId);
        
        // Fetch unlocks for this new generation (in case there are any)
        if (user && response.data.data.generationId) {
          try {
            const unlocksResponse = await api.get(`/api/unlocks/${user.uid}`);
            if (unlocksResponse.data.success && unlocksResponse.data.unlocks) {
              // Filter unlocks for this new generation only
              const currentGenerationUnlocks = unlocksResponse.data.unlocks.filter(
                u => u.generationId === response.data.data.generationId
              );
              const unlockedCombinations = new Set(
                currentGenerationUnlocks.map(u => `${u.generationId}_${u.logoIndex}`)
              );
              setUnlockedLogos(unlockedCombinations);
              console.log('🔓 Loaded unlocks for new generation:', unlockedCombinations);
            }
          } catch (unlockError) {
            console.log('📝 No unlocks found for new generation');
          }
        }
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


  const handleUnlockClick = (logo, index) => {
    setSelectedLogo({ ...logo, index });
    setSelectedTier('Standard');
    setShowUnlockModal(true);
    
    console.log('🔄 Unlock modal opened with balance:', userCredits);
  };

  const handleUnlock = async () => {
    if (!selectedLogo || !generatedLogos) return;

    // Final credit validation before API call
    if (userCredits < tierCosts[selectedTier]) {
      toast.error('Insufficient credits. Please top up your OPPAL balance.');
      return;
    }

    try {
      setIsUnlocking(true);
      
      console.log('🔐 Unlocking logo:', selectedLogo.index, 'Tier:', selectedTier);
      
      const response = await api.post('/api/unlock-logo', {
        generationId: generatedLogos.generationId,
        logoIndex: selectedLogo.index,
        selectedTier
      });

      if (response.data.success) {
        console.log('✅ Logo unlocked successfully');
        
        // Add to unlocked logos set with generation-specific combination
        const newUnlocked = new Set(unlockedLogos);
        const unlockKey = `${generatedLogos.generationId}_${selectedLogo.index}`;
        newUnlocked.add(unlockKey);
        setUnlockedLogos(newUnlocked);
        console.log('🔓 Added unlock combination:', unlockKey);
        
        // Close modal
        setShowUnlockModal(false);
        
        // Trigger download after successful unlock
        handleDownload(selectedLogo.imageUrl, selectedLogo.style, selectedLogo.index);
        
        // Show success toast
        toast.success(`Success! ${response.data.data.cost} OPPAL deducted. Your clean logo is ready for download.`);
        
        // Refresh credits after successful unlock
        try {
          const refreshResponse = await api.get('/api/credits/balance');
          if (refreshResponse.data.success) {
            setUserCredits(refreshResponse.data.data?.credits || 0);
            console.log('💰 Credits refreshed after unlock:', refreshResponse.data.data?.credits);
          }
        } catch (error) {
          console.error('Error refreshing credits:', error);
        }
      } else {
        console.error('❌ Unlock failed:', response.data.message);
        
        if (response.data.message.includes('Insufficient')) {
          toast.error('Insufficient credits. Please top up your OPPAL balance.');
          // Could redirect to pricing page here
          // navigate('/pricing');
        } else {
          toast.error(response.data.message || 'Failed to unlock logo');
        }
      }
    } catch (error) {
      console.error('❌ Error unlocking logo:', error);
      toast.error('Failed to unlock logo. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleDownload = async (imageUrl, logoStyle, index) => {
    try {
      setDownloadingLogo(index);
      
      console.log('🔄 Starting download for:', logoStyle, imageUrl);
      
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Convert response to blob
      const blob = await response.blob();
      console.log('📦 Blob created, size:', blob.size, 'type:', blob.type);
      
      // Create object URL from blob
      const objectUrl = URL.createObjectURL(blob);
      
      // Generate clean filename
      const brandName = generatedLogos?.brandName || businessIdea.trim().split(' ')[0] || 'logo';
      const cleanBrandName = brandName.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanLogoStyle = logoStyle.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `1DollarLogo-${cleanBrandName}-${cleanLogoStyle}.png`;
      
      // Create hidden anchor element
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to DOM, trigger click, and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up after download
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }, 100);
      
      console.log('✅ Logo downloaded successfully as:', filename);
    } catch (error) {
      console.error('❌ Error downloading logo:', error);
      
      // Fallback: open in new tab if download fails
      window.open(imageUrl, '_blank');
      alert('Download failed. Image opened in new tab. Right-click and save as.');
    } finally {
      setDownloadingLogo(null);
    }
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
                  disabled={isLoading || !user}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {isLoading ? "Generating..." : (!user ? "Login to Generate" : "Generate Logos")}
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
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={logo.imageUrl}
                        alt={`${logo.style} logo concept`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSI1MTIiIHk9IjUxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIyNCI+SW1hZ2UgTG9hZGluZzwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      
                      {/* Watermark Overlay - Only show if not unlocked for this generation */}
                      {!unlockedLogos.has(`${generatedLogos.generationId}_${index}`) && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div 
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 80px,
                                rgba(0, 0, 0, 0.2) 80px,
                                rgba(0, 0, 0, 0.2) 100px
                              ), repeating-linear-gradient(
                                -45deg,
                                transparent,
                                transparent 80px,
                                rgba(0, 0, 0, 0.2) 80px,
                                rgba(0, 0, 0, 0.2) 100px
                              )`,
                              backgroundSize: '250px 250px',
                              mixBlendMode: 'difference',
                              opacity: 0.7
                            }}
                          >
                            <div className="relative w-full h-full">
                              {/* Repeated watermark text grid with balanced spacing */}
                              <div className="absolute inset-0 grid grid-cols-2 gap-16 p-6" style={{ transform: 'rotate(-45deg) scale(1.6)' }}>
                                <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                                <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                                <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                                <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                                <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                                <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                              </div>
                              
                              {/* Additional pattern for full coverage */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-3xl font-normal text-gray-700 opacity-25 rotate-[-45deg] select-none whitespace-nowrap mix-blend-mode-overlay">
                                  1DollarLogo.com
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-900 font-bold mb-2">{logo.style}</h3>
                      <p className="text-gray-700 text-sm mb-3">
                        {logo.description}
                      </p>
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {logo.style.toLowerCase()}
                          </span>
                        </div>
                        
                        {/* Unlock/Download Button */}
                        <button
                          onClick={() => {
                            const unlockKey = `${generatedLogos.generationId}_${index}`;
                            if (unlockedLogos.has(unlockKey)) {
                              // Direct download if already unlocked
                              handleDownload(logo.imageUrl, logo.style, index);
                            } else {
                              // Open unlock modal if not unlocked
                              handleUnlockClick(logo, index);
                            }
                          }}
                          disabled={downloadingLogo === index}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                        >
                          {downloadingLogo === index ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Downloading...
                            </>
                          ) : unlockedLogos.has(`${generatedLogos.generationId}_${index}`) ? (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download Clean Version
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4 mr-2" />
                              Unlock Logo
                            </>
                          )}
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

      {/* Unlock Modal */}
      {showUnlockModal && selectedLogo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock Logo</h2>
            
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Logo:</strong> {selectedLogo.style}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Current Balance:</strong> 
                <span className="font-mono">
                  {isCreditsLoading ? (
                    <span className="inline-flex items-center">
                      <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-solid border-current border-r-transparent align-middle mr-2"></span>
                      <span className="text-gray-400">Loading...</span>
                    </span>
                  ) : (
                    userCredits
                  )}
                </span> OPPAL
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div 
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedTier === 'Standard' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier('Standard')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">Standard</div>
                    <div className="text-sm text-gray-600">Web-ready PNG/JPG</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">10 OPPAL</div>
                </div>
              </div>

              <div 
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedTier === 'Premium' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier('Premium')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">Premium</div>
                    <div className="text-sm text-gray-600">High-res + Transparency</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">20 OPPAL</div>
                </div>
              </div>

              <div 
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedTier === 'Exclusive' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier('Exclusive')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">Exclusive</div>
                    <div className="text-sm text-gray-600">Vector (SVG) conversion</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">35 OPPAL</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <strong>Remaining Balance:</strong> 
              <span className={`font-mono ${
                !isCreditsLoading && userCredits < tierCosts[selectedTier] ? 'text-red-600 font-semibold' : ''
              }`}>
                {isCreditsLoading ? '---' : 
                 userCredits < tierCosts[selectedTier] ? 'N/A' : 
                 userCredits - tierCosts[selectedTier]}
              </span> OPPAL
              
              {/* Get More OPPAL link when insufficient credits */}
              {!isCreditsLoading && userCredits < tierCosts[selectedTier] && (
                <div className="mt-2">
                  <button
                    onClick={() => window.location.href = '/#pricing-section'}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                  >
                    Get More OPPAL →
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                disabled={isUnlocking || isCreditsLoading || userCredits < tierCosts[selectedTier]}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  isUnlocking || isCreditsLoading || userCredits < tierCosts[selectedTier]
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isUnlocking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Unlocking...
                  </>
                ) : isCreditsLoading ? (
                  'Checking Balance...'
                ) : userCredits < tierCosts[selectedTier] ? (
                  'Insufficient OPPAL'
                ) : (
                  'Unlock Logo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateLogo;
