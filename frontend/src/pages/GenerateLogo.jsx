import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Download } from "lucide-react";
import api from "../api/axios";
import LoginModal from "../components/LoginModal";
import UnlockModal from "../components/UnlockModal";

// Offensive keywords for validation
const OFFENSIVE_KEYWORDS = [
  "porn",
  "sex",
  "sexual",
  "erotic",
  "adult",
  "xxx",
  "nsfw",
  "escort",
  "prostitute",
  "hooker",
  "stripper",
  "strip club",
  "drugs",
  "cocaine",
  "heroin",
  "marijuana",
  "weed",
  "kill",
  "murder",
  "suicide",
  "death",
  "violent",
  "hate",
  "racist",
  "nazi",
  "terrorism",
  "bomb",
  "illegal",
  "criminal",
  "fraud",
  "scam",
  "theft",
];

const GenerateLogo = () => {
  const [businessIdea, setBusinessIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState(null);
  const [brandData, setBrandData] = useState({});
  const [error, setError] = useState(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [unlockedLogos, setUnlockedLogos] = useState(new Set());
  const navigate = useNavigate();
  const { user, getIdToken } = useAuth();

  // Helper function to create Cloudinary preview URL with proper error handling
  const createPreviewUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary.com")) {
      return cloudinaryUrl; // Return as-is if not Cloudinary URL
    }

    try {
      // Test with simplified watermark transformation first
      const simpleTransformations =
        "w_512,h_512,c_fill,q_60/l_text:Arial_40_bold:OneDollarLogo.com,co_rgb:808080,o_30,a_-45,fl_tiled";

      // Split URL at /upload/ and insert transformations
      const uploadIndex = cloudinaryUrl.indexOf("/upload/");
      if (uploadIndex === -1) {
        return cloudinaryUrl; // Fallback if no upload segment found
      }

      const beforeUpload = cloudinaryUrl.substring(0, uploadIndex + 8); // Include '/upload/'
      const afterUpload = cloudinaryUrl.substring(uploadIndex + 8);

      // Insert transformations after /upload/
      const transformedUrl = `${beforeUpload}${simpleTransformations}/${afterUpload}`;

      return transformedUrl;
    } catch (error) {
      console.error("Error creating Cloudinary preview URL:", error);
      return cloudinaryUrl; // Fallback to original URL if transformation fails
    }
  };

  // Validation functions
  const validateInput = (input) => {
    const trimmedInput = input.trim();

    // Length validation (reduced to 3 characters)
    if (trimmedInput.length < 3) {
      return {
        isValid: false,
        message: "Please provide at least 3 characters for your business idea.",
      };
    }

    // Offensive content validation
    const lowerInput = trimmedInput.toLowerCase();
    const foundOffensive = OFFENSIVE_KEYWORDS.some((keyword) =>
      lowerInput.includes(keyword.toLowerCase()),
    );

    if (foundOffensive) {
      return {
        isValid: false,
        message: "Please remove inappropriate content from your business idea.",
      };
    }

    return { isValid: true };
  };

  // Check if input is valid for button state
  const isInputValid = () => {
    const validation = validateInput(businessIdea);
    return validation.isValid;
  };

  // Show error toast
  const showErrorToast = (message) => {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm";
    toast.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">{"\u274c"}</span>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  // Fetch user credits
  const fetchUserCredits = async () => {
    if (!user) return;

    try {
      const idToken = await getIdToken();
      const response = await api.get('/api/credits/balance');

      if (response.data.success) {
        setUserCredits(response.data.data?.credits || 0);
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  // Handle logo unlock
  const handleUnlockLogo = async (unlockData) => {
    if (!user) return;
    
    try {
      const idToken = await getIdToken();
      const response = await api.post('/api/credits/unlock-logo', { generationId: unlockData.generationId });

      if (response.data.success) {
        setUserCredits(response.data.data?.credits || 0);
        if (unlockData.logoId) {
          setUnlockedLogos((prev) => new Set([...prev, unlockData.logoId]));
        }
        
        const tierName = response.data.data.tier || 'Logo';
        console.log(`Logo unlocked with ${tierName} tier!`);
        // Close the unlock modal
        setShowUnlockModal(false);
      } else {
        alert(response.data.message || "Failed to unlock logo");
      }
    } catch (error) {
      console.error("Error unlocking logo:", error);
      alert("Failed to unlock logo. Please try again.");
    }
  };

  // Check if logo is unlocked
  const isLogoUnlocked = (logo) => {
    return unlockedLogos.has(logo.imageId || logo.id);
  };

  // Check for existing generations on component mount
  useEffect(() => {
    const loadExistingGenerations = async () => {
      if (user) {
        try {
          const idToken = await getIdToken();
          // Get the latest generation for this user
          const generationsResponse = await api.get(`/api/generations/${user.uid}`);

          if (generationsResponse.data.success && generationsResponse.data.data.length > 0) {
            const latestGeneration = generationsResponse.data.data[0];
            setGeneratedLogos({
              businessIdea: latestGeneration.businessIdea,
              brandName: latestGeneration.brandName,
              niche: latestGeneration.niche,
              vibe: latestGeneration.vibe,
              logos: latestGeneration.logos,
              generatedAt: latestGeneration.createdAt,
            });
            setBrandData({
              brandName: latestGeneration.brandName,
              niche: latestGeneration.niche,
              vibe: latestGeneration.vibe,
            });
            console.log("Loaded existing generation:", latestGeneration);
          }
        } catch (error) {
          console.error("Error loading existing generations:", error);
        }
      }
    };

    loadExistingGenerations();
  }, [user, getIdToken]);

  // Fetch user credits when user changes
  useEffect(() => {
    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    // Only prevent default if event object exists
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Mark that user has attempted submission
    setHasAttemptedSubmit(true);
    
    // Validate input before submission
    const validation = validateInput(businessIdea);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    // Show "Coming Soon" toast notification instead of calling API
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm";
    toast.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">🚀</span>
        <span>Coming Soon! We are fine-tuning our AI engine to provide the best logos for you.</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Remove toast after 5 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 5000);
  };

  const handleRegenerate = () => {
    setGeneratedLogos(null);
    handleSubmit();
  };

  const handleBack = () => {
    navigate("/");
  };

  // Download logo function
  const downloadLogo = async (logo, index) => {
    try {
      // Check if this is a Cloudinary URL, Firebase Storage URL, or OpenAI URL
      const isCloudinaryUrl =
        logo.imageUrl && logo.imageUrl.includes("cloudinary.com");
      const isFirebaseUrl =
        logo.imageUrl && logo.imageUrl.includes("storage.googleapis.com");

      // Create friendly filename
      const brandName = brandData?.brandName || "logo";
      const filename = `${brandName.replace(/\s+/g, "_").toLowerCase()}_logo_${index + 1}.png`;

      if (isCloudinaryUrl) {
        // For Cloudinary URLs, fetch and download as blob
        console.log("Downloading from Cloudinary:", logo.imageUrl);

        try {
          const response = await fetch(logo.imageUrl, {
            mode: "cors",
            headers: {
              Accept: "image/png,image/jpeg,image/*",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.style.display = "none";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up object URL
          setTimeout(() => window.URL.revokeObjectURL(url), 100);

          console.log("✅ Cloudinary image downloaded successfully");
        } catch (fetchError) {
          console.error("Error fetching Cloudinary image:", fetchError);
          // Fallback to opening in new tab
          const link = document.createElement("a");
          link.href = logo.imageUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.download = filename;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else if (isFirebaseUrl) {
        // For Firebase Storage URLs, we can try direct download
        console.log("Downloading from Firebase Storage:", logo.imageUrl);

        const link = document.createElement("a");
        link.href = logo.imageUrl;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For OpenAI URLs or other URLs, open in new tab
        console.log("Opening image in new tab:", logo.imageUrl);

        const link = document.createElement("a");
        link.href = logo.imageUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading logo:", error);
      // Fallback: copy URL to clipboard
      try {
        navigator.clipboard.writeText(logo.imageUrl);
        alert(
          "Image URL copied to clipboard. Please paste in browser to download.",
        );
      } catch (clipboardError) {
        alert(
          'Unable to download image. Please right-click the image and select "Save image as".',
        );
      }
    }
  };

  // Download logo function
  const handleDownload = async (imageUrl, logoName, index) => {
    try {
      console.log('🔄 Starting download for:', logoName);
      
      // Try direct fetch first (for Cloudinary URLs)
      let response;
      try {
        response = await fetch(imageUrl, {
          mode: 'cors',
          headers: {
            'Accept': 'image/png,image/jpeg,image/*',
            'User-Agent': 'OneDollarLogo-Frontend/1.0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (corsError) {
        console.log('⚠️ CORS error, trying backend proxy:', corsError.message);
        
        // Fallback to backend proxy for CORS issues
        const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}`;
        const proxyResponse = await api.get(proxyUrl, { responseType: 'blob' });
        
        if (!proxyResponse.status) {
          throw new Error(`Backend proxy failed: HTTP ${proxyResponse.status}`);
        }
        
        // Create a mock Response object from axios response
        response = {
          ok: true,
          blob: () => Promise.resolve(proxyResponse.data)
        };
      }
      
      // Convert to blob
      const blob = await response.blob();
      console.log('📦 Blob created, size:', blob.size, 'type:', blob.type);
      
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      
      // Generate clean filename
      const businessName = brandData?.brandName || businessIdea.trim().split(' ')[0] || 'logo';
      const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanLogoName = logoName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `1DollarLogo-${cleanBusinessName}-${cleanLogoName}.png`;
      
      // Create hidden anchor and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ Logo downloaded successfully as:', filename);
    } catch (error) {
      console.error('❌ Error downloading logo:', error);
      
      // Final fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert('Image URL copied to clipboard. Please paste in browser to download.');
      } catch (clipboardError) {
        alert('Unable to download. Please right-click the image and select "Save image as".');
      }
    }
  };

  // Start new project function
  const handleStartNewProject = () => {
    setGeneratedLogos(null);
    setBrandData({});
    setBusinessIdea("");
    setError(null);
    setHasAttemptedSubmit(false);
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
        </div>

        {/* Input Form */}
        {!isLoading && !generatedLogos && (
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

              {error && hasAttemptedSubmit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !isInputValid()}
                className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {user ? "Generate Logos" : "Login to Generate"}
              </button>
            </form>
          </div>
        )}

        {/* Generate New Button */}
        {generatedLogos && (
          <div className="text-center mb-8">
            <button
              onClick={handleStartNewProject}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              <span className="mr-2">+ Generate New</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="text-center">
                {/* AI Thinking Animation */}
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
                  AI is thinking...
                </h2>
                <p className="text-gray-600 mb-2">
                  Analyzing your business concept
                </p>
                <p className="text-gray-600 mb-2">
                  Generating brand DNA with Gemini AI
                </p>
                <p className="text-gray-600">
                  Creating 4 unique logo variations
                </p>

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
                Based on: "{generatedLogos.businessIdea}"
              </p>
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Generate New Concepts
              </button>
            </div>

            {/* Brand Analysis Card - Only show after loading is finished and data exists */}
            {!isLoading &&
              generatedLogos &&
              generatedLogos.logos &&
              generatedLogos.logos.length > 0 && (
                <div className="mb-8 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="mr-3 text-blue-600">DNA</span>
                      Brand Analysis
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Brand Name */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2 text-blue-600">TAG</span>
                          <h4 className="text-gray-900 font-semibold text-lg">
                            Brand Name
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {brandData.brandName || "Not specified"}
                        </p>
                      </div>

                      {/* Niche */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2 text-blue-600">TARGET</span>
                          <h4 className="text-gray-900 font-semibold text-lg">
                            Market Niche
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {brandData.niche || "Not identified"}
                        </p>
                      </div>

                      {/* Brand Vibe */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2 text-blue-600">SPARKLE</span>
                          <h4 className="text-gray-900 font-semibold text-lg">
                            Brand Vibe
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {brandData.vibe || "Not defined"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedLogos.logos.map((logo, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300"
                >
                  {/* Logo Image */}
                  <div className="relative aspect-square bg-gray-50 group">
                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(logo.cloudinaryUrl || logo.imageUrl, logo.style, index)}
                      className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 p-2 rounded-lg shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                      title={`Download ${logo.style} logo`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <img
                      src={createPreviewUrl(logo.cloudinaryUrl || logo.imageUrl)}
                      alt={`${logo.style} logo concept`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Prevent infinite loop by checking if we've already tried fallback
                        if (!e.target.dataset.fallbackAttempted) {
                          e.target.dataset.fallbackAttempted = "true";
                          e.target.onerror = null; // Prevent infinite loop
                          // Fallback to original URL if transformed URL fails
                          e.target.src = logo.originalImageUrl || logo.imageUrl;
                        }
                      }}
                    />

                    {/* Hover Overlay for Brand DNA */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 w-full h-full p-4">
                        <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 max-w-sm">
                          <h4 className="text-white font-bold text-sm mb-2">
                            {logo.style}
                          </h4>
                          <p className="text-gray-200 text-xs mb-2 line-clamp-2">
                            {logo.description}
                          </p>

                          {/* Brand DNA Details */}
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 font-medium">
                                Concept:
                              </span>
                              <span className="text-white ml-1">
                                {logo.style}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 font-medium">
                                Target Audience:
                              </span>
                              <span className="text-white ml-1">
                                {brandData?.niche || "General"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 font-medium">
                                Brand Vibe:
                              </span>
                              <span className="text-white ml-1">
                                {brandData?.vibe || "Professional"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo Details */}
                  <div className="p-4">
                    <h3 className="text-gray-900 font-bold mb-2">{logo.style}</h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {logo.description}
                    </p>

                    {/* Color Palette */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-gray-600 text-xs">Colors:</span>
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
                      <span className="text-gray-600 text-xs">
                        Typography:{" "}
                      </span>
                      <span className="text-gray-700 text-xs">
                        {logo.typography}
                      </span>
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

                    {/* Download/Unlock Button */}
                    <div className="mt-4">
                      {isLogoUnlocked(logo) ? (
                        <button
                          onClick={() => downloadLogo(logo, index)}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                        >
                          <span className="mr-2">Download</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedLogo(logo);
                            setShowUnlockModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                        >
                          <span className="mr-2">Unlock This Logo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-12 pt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Love Your Logo?
                </h3>
                <p className="text-gray-500 mb-6 text-center">
                  Get high-resolution files and unlimited revisions with our
                  premium packages
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:from-blue-800 focus:to-purple-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                  View Pricing Packages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        )}

        {/* Unlock Modal */}
        {showUnlockModal && selectedLogo && (
          <UnlockModal
            isOpen={showUnlockModal}
            onClose={() => setShowUnlockModal(false)}
            onUnlock={handleUnlockLogo}
            logo={selectedLogo}
            userCredits={userCredits}
          />
        )}
      </div>
    </>
  );
};

export default GenerateLogo;
