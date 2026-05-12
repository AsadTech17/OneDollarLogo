import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Unlock, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil, faUser, faHeart, faFile, faAddressCard, faTshirt,
  faDesktop, faWrench, faCloudArrowUp, faArrowRight, faClock,
  faCircleCheck, faAdjust, faImage, faWandMagicSparkles, faTag
} from "@fortawesome/free-solid-svg-icons";

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
  const [unlockedLogos, setUnlockedLogos] = useState(new Set());
  const [vectorizingLogos, setVectorizingLogos] = useState(new Set());
  const [currentGenerationId, setCurrentGenerationId] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(['logo']);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileQueue, setFileQueue] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const [fileUploadProgress, setFileUploadProgress] = useState({});
  const [fileUseCase, setFileUseCase] = useState({});
  const [brandName, setBrandName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [questions, setQuestions] = useState({});
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(10);
  const [dragActive, setDragActive] = useState(false);
  const [brandStyle, setBrandStyle] = useState([]);
  const [usageLocations, setUsageLocations] = useState([]);
  const [colorsToAvoid, setColorsToAvoid] = useState("");
  const [symbolsToInclude, setSymbolsToInclude] = useState("");
  const [symbolsToAvoid, setSymbolsToAvoid] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [tempColor, setTempColor] = useState("#000000");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
 
  const [photoUse, setPhotoUse] = useState("");
  const [headshotBackground, setHeadshotBackground] = useState("");
  const [headshotStyle, setHeadshotStyle] = useState("");
  const [retouchLevel, setRetouchLevel] = useState("Light");
 
  const [flyerHeadline, setFlyerHeadline] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [flyerOffer, setFlyerOffer] = useState("");
  
  const [merchProductType, setMerchProductType] = useState("");
  const [merchPlacement, setMerchPlacement] = useState("");
  const [merchProductColor, setMerchProductColor] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const colorPickerRef = useRef(null);
  const tierCosts = {
    Standard: 10,
    Premium: 20,
    Exclusive: 35
  };

  const ACCEPTED_FILE_TYPES = {
    images: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    fonts: ['ttf', 'otf', 'woff', 'woff2'],
    documents: ['pdf']
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
  const MAX_FILES = 10;

  const fileUseCases = ['Redesign', 'Reference', 'Brand inspiration only'];

  const isFileTypeAccepted = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const allAcceptedTypes = [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.fonts, ...ACCEPTED_FILE_TYPES.documents];
    return allAcceptedTypes.includes(ext);
  };

  const getFileCategory = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ACCEPTED_FILE_TYPES.images.includes(ext)) return 'images';
    if (ACCEPTED_FILE_TYPES.fonts.includes(ext)) return 'fonts';
    if (ACCEPTED_FILE_TYPES.documents.includes(ext)) return 'documents';
    return 'unknown';
  };

  const getFilePreview = (fileObj) => {
    if (!fileObj || !fileObj.blob) return null;
    const ext = fileObj.name.split('.').pop().toLowerCase();
    if (ACCEPTED_FILE_TYPES.images.includes(ext)) {
      return URL.createObjectURL(fileObj.blob);
    }
    return null;
  };

  const getFileIcon = (filename) => {
    if (!filename || typeof filename !== 'string') return '📎';
    const ext = filename.split('.').pop().toLowerCase();
    if (ACCEPTED_FILE_TYPES.fonts.includes(ext)) return '🔤';
    if (ACCEPTED_FILE_TYPES.documents.includes(ext)) return '📄';
    if (ACCEPTED_FILE_TYPES.images.includes(ext)) return '🖼️';
    return '📎';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const totalQueueSize = fileQueue.reduce((sum, f) => sum + f.size, 0);
    let addedCount = 0;

    for (const file of newFiles) {
      if (fileQueue.length + addedCount >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`);
        break;
      }

      if (!isFileTypeAccepted(file.name)) {
        toast.error(`${file.name}: File type not accepted`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File exceeds 10 MB limit`);
        continue;
      }

      if (totalQueueSize + file.size > MAX_TOTAL_SIZE) {
        toast.error(`Total file size exceeds 50 MB limit`);
        break;
      }

      if (fileQueue.some(f => f.name === file.name && f.size === file.size)) {
        toast.error(`${file.name}: Duplicate file`);
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      setFileQueue(prev => [...prev, { blob: file, fileId, size: file.size, name: file.name, type: file.type }]);
      setFileUseCase(prev => ({ ...prev, [fileId]: 'Reference' }));
      setFileUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      addedCount++;
    }
  };

  const removeFileFromQueue = (fileId) => {
    setFileQueue(prev => {
      const fileToRemove = prev.find(f => f.fileId === fileId);
      if (fileToRemove && fileToRemove.blob) {
        URL.revokeObjectURL(URL.createObjectURL(fileToRemove.blob));
      }
      return prev.filter(f => f.fileId !== fileId);
    });
    const newProgress = { ...fileUploadProgress };
    delete newProgress[fileId];
    setFileUploadProgress(newProgress);
    const newUseCase = { ...fileUseCase };
    delete newUseCase[fileId];
    setFileUseCase(newUseCase);
  };

  const handleUploadFiles = async () => {
    if (fileQueue.length === 0) {
      toast.error('No files to upload');
      return;
    }

    if (!user) {
      toast.error('Please log in to upload files');
      return;
    }

    setUploadingFiles(new Set(fileQueue.map(f => f.fileId)));

    try {
      const uploadPromises = fileQueue.map(async (fileObj) => {
        const formData = new FormData();
        formData.append('file', fileObj.blob);
        formData.append('useCase', fileUseCase[fileObj.fileId] || 'Reference');

        try {
          const response = await api.post('/api/upload-brand-files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setFileUploadProgress(prev => ({
                ...prev,
                [fileObj.fileId]: percentCompleted
              }));
            }
          });

          if (response.data.success) {
            setUploadedFiles(prev => [...prev, response.data.data]);
            return true;
          } else {
            toast.error(`Failed to upload ${fileObj.name}`);
            return false;
          }
        } catch (error) {
          console.error(`Error uploading ${fileObj.name}:`, error);
          toast.error(`Error uploading ${fileObj.name}`);
          return false;
        }
      });

      await Promise.all(uploadPromises);
      setFileQueue([]);
      setUploadingFiles(new Set());
      toast.success('Files uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploadingFiles(new Set());
    }
  };

  const products = [
    { id: 'logo', name: 'Logo', icon: faPencil, cost: 10, description: 'Create unique concepts' },
    { id: 'headshot', name: 'Headshot', icon: faUser, cost: 0, description: 'AI-professional photos' },
    { id: 'socialkit', name: 'Social Kit', icon: faHeart, cost: 20, description: 'Design graphics set' },
    { id: 'flyer', name: 'Flyer', icon: faFile, cost: 15, description: 'Create eye-catching design' },
    { id: 'businesscard', name: 'Business Card', icon: faAddressCard, cost: 10, description: 'Branded print ready' },
    { id: 'merch', name: 'Merch Mockup', icon: faTshirt, cost: 15, description: 'Visualize products' },
    { id: 'website', name: 'Website Kit', icon: faDesktop, cost: 45, description: 'Prepare launch assets' },
    { id: 'designer', name: 'Designer Assist', icon: faWrench, cost: 25, description: 'Human-designer polish' }
  ];

  const colorOptions = [
  ];

  const symbolOptions = [
    'Geometric', 'Nature', 'Abstract', 'Tech', 'Minimalist', 'Classic'
  ];

  useEffect(() => {
    const totalCost = selectedProducts.reduce((sum, productId) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.cost || 0);
    }, 0);
    setEstimatedCost(totalCost || 10);
  }, [selectedProducts]);

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

  const loadingMessages = [
    "Analyzing your brand...",
    "Designing concepts...",
    "Finalizing logos..."
  ];

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

  useEffect(() => {
    const loadExistingGenerations = async () => {
      if (user) {
        console.log('🔍 Frontend: Loading existing generations for user:', user.uid);
        setIsLoadingExisting(true);

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
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      // Redirect to login page for non-authenticated users
      navigate('/login');
      return;
    }

   

    setIsLoading(true);
    setError(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const response = await api.post('/api/generate', {
     
        brandName: brandName.trim(),
        businessType: businessType.trim(),
        selectedProducts: selectedProducts,
        selectedColors: selectedColors,
        brandStyle: brandStyle,
        usageLocations: usageLocations,
        colorsToAvoid: colorsToAvoid.trim(),
        symbolsToInclude: symbolsToInclude.trim(),
        symbolsToAvoid: symbolsToAvoid.trim(),
        selectedPlatforms: selectedPlatforms,
        contactInfo: {
          name: contactName.trim(),
          title: contactTitle.trim(),
          phone: contactPhone.trim(),
          email: contactEmail.trim(),
          website: contactWebsite.trim()
        },
       
        headshot: {
          photoUse: photoUse.trim(),
          background: headshotBackground.trim(),
          style: headshotStyle.trim(),
          retouchLevel: retouchLevel.trim()
        },
       
        flyer: {
          headline: flyerHeadline.trim(),
          dateTime: eventDateTime.trim(),
          location: eventLocation.trim(),
          offer: flyerOffer.trim()
        },
        
        merch: {
          productType: merchProductType.trim(),
          placement: merchPlacement.trim(),
          productColor: merchProductColor.trim()
        }
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

      console.log(' Unlocking logo:', selectedLogo.index, 'Tier:', selectedTier);

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

        // Close modal ONLY after successful unlock
        setShowUnlockModal(false);

        // For Exclusive tier, SVG should be available due to strict await
        if (selectedTier === 'Exclusive') {
          if (response.data.data.svgUrl) {
            console.log('✅ SVG URL available in response, downloading SVG:', response.data.data.svgUrl);
            toast.success('Exclusive logo unlocked with vectorization! Downloading SVG...');

            // Wait a moment for state to refresh, then download SVG directly
            setTimeout(async () => {
              try {
                const svgResponse = await fetch(response.data.data.svgUrl);
                if (!svgResponse.ok) {
                  throw new Error(`HTTP error! status: ${svgResponse.status}`);
                }

                const svgBlob = await svgResponse.blob();
                const svgObjectUrl = URL.createObjectURL(svgBlob);

                // Generate SVG filename
                const brandName = generatedLogos?.brandName || businessIdea.trim().split(' ')[0] || 'logo';
                const cleanBrandName = brandName.replace(/[^a-zA-Z0-9]/g, '_');
                const cleanLogoStyle = selectedLogo.style.replace(/[^a-zA-Z0-9]/g, '_');
                const svgFilename = `1DollarLogo-${cleanBrandName}-${cleanLogoStyle}.svg`;

                // Create hidden anchor element for SVG
                const svgLink = document.createElement('a');
                svgLink.href = svgObjectUrl;
                svgLink.download = svgFilename;
                svgLink.style.display = 'none';

                document.body.appendChild(svgLink);
                svgLink.click();

                setTimeout(() => {
                  document.body.removeChild(svgLink);
                  URL.revokeObjectURL(svgObjectUrl);
                }, 100);

                console.log('✅ SVG downloaded successfully as:', svgFilename);
              } catch (svgError) {
                console.error('❌ Error downloading SVG:', svgError);
                toast.error('Failed to download SVG. Please try downloading manually.');
              }
            }, 1000); // Wait 1 second for state to refresh
          } else {
            console.log('❌ SVG URL not available in response - this should not happen with strict await');
            toast.error('Vectorization failed. Please try again.');
          }
        } else {
          // Trigger download for non-Exclusive tiers
          handleDownload(selectedLogo.imageUrl, selectedLogo.style, selectedLogo.index, selectedTier);
        }

        // Show success toast
        toast.success(`Success! ${response.data.data.cost} OPPAL deducted.`);

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

  const handleDownload = async (imageUrl, logoStyle, index, selectedTier = null) => {
    try {
      setDownloadingLogo(index);

      console.log('🔄 Starting download for:', logoStyle, imageUrl, 'Tier:', selectedTier);

      // For Exclusive plan, check if SVG is available
      if (selectedTier === 'Exclusive') {
        console.log('🔍 Checking for SVG download for Exclusive plan');

        try {
          // Get unlock data to check for SVG URL
          const unlockResponse = await api.get(`/api/unlocks/${user.uid}`);
          console.log('📥 Unlock data received:', unlockResponse.data);

          if (unlockResponse.data.success && unlockResponse.data.unlocks) {
            const unlockKey = `${generatedLogos.generationId}_${index}`;
            console.log('🔍 Looking for unlock key:', unlockKey);

            const unlockData = unlockResponse.data.unlocks.find(u => {
              const dataKey = `${u.generationId}_${u.logoIndex}`;
              console.log('🔍 Comparing keys:', dataKey, '===', unlockKey);
              return dataKey === unlockKey;
            });

            console.log('🔍 Found unlock data:', unlockData);

            if (unlockData && unlockData.svgUrl && unlockData.vectorizationStatus === 'completed') {
              console.log('✅ SVG URL found, downloading SVG:', unlockData.svgUrl);

              // Download SVG
              const svgResponse = await fetch(unlockData.svgUrl);

              if (!svgResponse.ok) {
                throw new Error(`HTTP error! status: ${svgResponse.status}`);
              }

              const svgBlob = await svgResponse.blob();
              console.log('📦 SVG Blob created, size:', svgBlob.size, 'type:', svgBlob.type);

              const svgObjectUrl = URL.createObjectURL(svgBlob);

              // Generate SVG filename
              const brandName = generatedLogos?.brandName || businessIdea.trim().split(' ')[0] || 'logo';
              const cleanBrandName = brandName.replace(/[^a-zA-Z0-9]/g, '_');
              const cleanLogoStyle = logoStyle.replace(/[^a-zA-Z0-9]/g, '_');
              const svgFilename = `1DollarLogo-${cleanBrandName}-${cleanLogoStyle}.svg`;

              // Create hidden anchor element for SVG
              const svgLink = document.createElement('a');
              svgLink.href = svgObjectUrl;
              svgLink.download = svgFilename;
              svgLink.style.display = 'none';

              document.body.appendChild(svgLink);
              svgLink.click();

              setTimeout(() => {
                document.body.removeChild(svgLink);
                URL.revokeObjectURL(svgObjectUrl);
              }, 100);

              console.log('✅ SVG downloaded successfully as:', svgFilename);
              return; // Exit early for SVG download
            } else if (unlockData && unlockData.vectorizationStatus === 'failed') {
              console.log('⚠️ Vectorization failed, falling back to PNG');
              toast.error('Vectorization failed. Downloading PNG instead.');
            } else if (unlockData && unlockData.vectorizationStatus === 'processing') {
              console.log('⏳ Vectorization still processing, downloading PNG for now');
              toast.warning('Vectorization still in progress. PNG downloaded now, SVG will be available soon.');
            } else {
              console.log('⚠️ No SVG URL found in unlock data, falling back to PNG');
              console.log('🔍 Unlock data details:', {
                hasUnlockData: !!unlockData,
                hasSvgUrl: !!(unlockData && unlockData.svgUrl),
                vectorizationStatus: unlockData?.vectorizationStatus,
                svgUrl: unlockData?.svgUrl
              });
            }
          } else {
            console.log('⚠️ No unlock data found, falling back to PNG');
          }
        } catch (svgError) {
          console.error('❌ Error checking SVG availability:', svgError);
          console.log('🔄 Falling back to PNG download');
        }
      }

      // Fallback to PNG download (for non-Exclusive plans or if SVG not available)
      console.log('📥 Downloading PNG file');

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('📦 PNG Blob created, size:', blob.size, 'type:', blob.type);

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

      document.body.appendChild(link);
      link.click();

      // Clean up after download
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }, 100);

      console.log('✅ PNG downloaded successfully as:', filename);
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
      <div className="w-screen bg-white">

        <div className=" flex flex-col items-center justify-center  ">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

            <div className="flex flex-col items-center w-screen -ml-7">
              <h1 className="text-2xl font-bold  text-[#011a43]">Welcome to 1Dollar Brand Studio</h1>
              <p className="text-gray-600 text-sm -mt-7">Your workspace for building logos, headshots, social kits, flyers, business cards, merch mockups, and launch-ready brand assets.</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
        {isLoadingExisting && (
          <div className="max-w-4xl mx-auto mt-12">
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
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#011a43] mb-4">Loading your designs...</h2>
                <p className="text-gray-600">Checking for existing projects</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !isLoadingExisting && !generatedLogos && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-12 border border-gray-200 p-3">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">1</div>
                <h3 className="text-xl font-bold text-[#011a43]">Choose What You Want to Create</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      if (selectedProducts.includes(product.id)) {
                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                      } else {
                        setSelectedProducts([...selectedProducts, product.id]);
                      }
                    }}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all relative ${selectedProducts.includes(product.id)
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                  >
                    {product.badge && (
                      <div className="absolute top-1 right-1 text-lg">{product.badge}</div>
                    )}
                    {selectedProducts.includes(product.id) && (
                      <div className="absolute top-1 right-2 w-5 h-5  bg-red-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}
                    <FontAwesomeIcon icon={product.icon} className="text-2xl text-[#011a43] mb-2" />
                    <span className="text-sm font-bold text-[#011a43] text-center">{product.name}</span>
                    <span className="text-xs text-gray-600 text-center mt-1 line-clamp-2">{product.description}</span>
                    <span className="text-xs font-mono text-[#011a43] font-bold mt-2">From {product.cost} OPPAL</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-8 ">
                <div className="border border-gray-200 p-3"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">2</div>
                    <h3 className="text-xl font-bold text-[#011a43]">Upload Files</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Upload logos, sketches, photos, inspiration, products, packaging, flyers, menu, or brand assets.</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}>
                      <FontAwesomeIcon icon={faCloudArrowUp} className="mx-auto text-4xl text-gray-400 mb-3" />
                      <p className="text-gray-600 font-semibold">Drag & drop files here or <label className="text-blue-600 cursor-pointer hover:underline">browse<input type="file" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" accept=".jpg,.jpeg,.png,.webp,.svg,.ttf,.otf,.woff,.woff2,.pdf" /></label></p>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, SVG, PDF accepted. Max 10 files</p>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-700 mb-3">How should we use this file?</p>
                      {fileQueue.length === 0 && uploadedFiles.length === 0 && (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          <p className="text-sm text-gray-500 text-center">No files selected</p>
                        </div>
                      )}
                      <div className="space-y-3 overflow-y-auto max-h-96">
                        {fileQueue.map((file) => {
                          const preview = getFilePreview(file);
                          return (
                            <div key={file.fileId} className="bg-white border-b border-gray-200 ">
                              <div className="flex items-start gap-3 mb-2">
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                  {preview ? (
                                    <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-2xl">{getFileIcon(file.name)}</span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-[#011a43] truncate">{file.name}</p>
                                  <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>

                                <select
                                  value={fileUseCase[file.fileId] || 'Reference'}
                                  onChange={(e) => setFileUseCase(prev => ({ ...prev, [file.fileId]: e.target.value }))}
                                  className="w-full ml-5 text-xs bg-white text-[#011a43] border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                >
                                  {fileUseCases.map(useCase => (
                                    <option key={useCase} value={useCase}>{useCase}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => removeFileFromQueue(file.fileId)}
                                  className="flex-shrink-0 text-[#011a43] hover:text-gray-700 font-bold text-xl"
                                >
                                  ×
                                </button>
                              </div>


                              {uploadingFiles.has(file.fileId) && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${fileUploadProgress[file.fileId] || 0}%` }}></div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{fileUploadProgress[file.fileId] || 0}%</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {uploadedFiles.map((uploadedFile, idx) => (
                          <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">✓</span>
                                <div>
                                  <p className="text-xs font-semibold text-[#011a43] truncate">{uploadedFile.name}</p>
                                  <p className="text-xs text-gray-500">{uploadedFile.useCase}</p>
                                </div>
                              </div>
                              <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-600 hover:text-red-700 font-bold text-lg ml-2">×</button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 p-3">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">3</div>
                    <h3 className="text-xl font-bold text-[#011a43]">Smart Questions</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">

                   

                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Brand / Business Name</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g., Acme Clean Co."
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Tagline or Slogan (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., Setting intention with every clean."
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">What do you sell or promote?</label>
                      <input
                        type="text"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        placeholder="e.g., Eco-friendly cleaning products and services."
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Who is this for?</label>
                      <input
                        type="text"
                        placeholder="e.g., Busy families and eco-conscious homeowners."
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">What should the brand feel like?</label>
                      <input
                        type="text"
                        placeholder="e.g., Trustworthy, premium, clean, and caring."
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Brand Style</label>
                      <div className="flex flex-wrap gap-2">
                        {['Clean', 'Premium', 'Bold', 'Luxury', 'Corporate', 'Minimal'].map((style) => (
                          <button
                            key={style}
                            onClick={() => {
                              if (brandStyle.includes(style)) {
                                setBrandStyle(brandStyle.filter(s => s !== style));
                              } else {
                                setBrandStyle([...brandStyle, style]);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${brandStyle.includes(style)
                              ? 'bg-[#011a43] text-white'
                              : 'bg-gray-200 text-[#011a43] hover:bg-gray-300'
                              }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Colors you want</label>
                      <div className="flex flex-wrap gap-3 items-center">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              if (selectedColors.includes(color)) {
                                setSelectedColors(selectedColors.filter(c => c !== color));
                              } else {
                                setSelectedColors([...selectedColors, color]);
                              }
                            }}
                            className={`w-[64.3125px] h-[42.1px] rounded-lg border-2 transition-all cursor-pointer ${selectedColors.includes(color) ? 'border-[#011a43] scale-110' : 'border-gray-200'}`}
                            style={{ backgroundColor: color }}
                            title={color === '#FFFFFF' ? 'White' : color === '#000000' ? 'Black' : 'Red'}
                          />
                        ))}
                        {selectedColors.map((color) => (
                          <button
                            key={`selected-${color}`}
                            onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                            className="w-[64.3125px] h-[42.1px] rounded-lg border-2 border-[#011a43] scale-110 hover:opacity-75 transition-all cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={`Click to remove ${color}`}
                          />
                        ))}
                        <button
                          onClick={() => {
                            setShowColorPickerModal(true);
                            setTempColor("#000000");
                          }}
                          className="px-3 py-2   text-gray-400 border border-gray-300 rounded-lg text-sm font-medium transition-all"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Colors to avoid</label>
                      <input
                        type="text"
                        value={colorsToAvoid}
                        onChange={(e) => setColorsToAvoid(e.target.value)}
                        placeholder="e.g., Neon green, Brown"
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Symbols or imagery to include</label>
                      <input
                        type="text"
                        value={symbolsToInclude}
                        onChange={(e) => setSymbolsToInclude(e.target.value)}
                        placeholder="e.g., Sparkles, leaves, home icons, water drops"
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Images or styles to avoid</label>
                      <input
                        type="text"
                        placeholder="e.g., Cartoon style, flat design, hand-drawn"
                        className="w-full px-4 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Where will this be used? <span className="text-gray-500 font-normal">(Select all that apply)</span></label>
                      <div className="flex flex-wrap gap-3">
                        {['Website', 'Social media', 'Business cards', 'Flyers', 'Merch', 'Packaging'].map((usage) => (
                          <label
                            key={usage}
                            className="flex items-center gap-3 px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#011a43] transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={usageLocations.includes(usage)}
                              onChange={() => {
                                if (usageLocations.includes(usage)) {
                                  setUsageLocations(usageLocations.filter(u => u !== usage));
                                } else {
                                  setUsageLocations([...usageLocations, usage]);
                                }
                              }}
                              className="
    w-5 h-5 appearance-none rounded border-2 border-gray-400 bg-transparent
    checked:bg-[#011a43] checked:border-0
    cursor-pointer relative
    focus:outline-none focus:ring-2 focus:ring-blue-500
    after:content-['✔']
    after:text-white
    after:text-xs
    after:font-bold
    after:absolute
    after:top-1/2
    after:left-1/2
    after:-translate-x-1/2
    after:-translate-y-1/2
    after:opacity-0
    checked:after:opacity-100
  "
                            />
                            <span className="text-sm font-medium text-[#011a43]">{usage}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#011a43] mb-2">Anything else the AI should know?</label>
                      <textarea
                        rows={2}
                        placeholder="e.g., We want a modern look with a premium feel. Keep it clean, simple, and memorable."
                        className="w-full px-4 py-3 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      />
                    </div>

                    <div className="mb-4 p-4 border border-blue-200 rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="
        mt-1 w-5 h-5 appearance-none rounded border-2 border-gray-400 bg-transparent
        checked:bg-[rgb(49,113,220)] checked:border-0
        focus:ring-2 focus:ring-blue-500 focus:outline-none
        relative
        after:content-['✔']
        after:text-white
        after:text-xs
        after:font-bold
        after:absolute
        after:top-1/2
        after:left-1/2
        after:-translate-x-1/2
        after:-translate-y-1/2
        after:opacity-0
        checked:after:opacity-100
      "
                        />
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-[#011a43]">
                            I confirm I have the right to upload and use these files.
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            AI outputs may need human review before trademark registration or large-scale commercial use.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6 max-h-96 flex flex-col">
                  <div className="flex-shrink-0 mb-4">
                    <h4 className="font-bold text-[#011a43] mb-2">Based on your selections</h4>
                    <p className="text-xs text-gray-600">Extra details help us create better designs tailored to your needs.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-3 space-y-4">
                    {selectedProducts.includes('socialkit') && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <label className="block text-sm font-semibold text-[#011a43] mb-3">Platforms (Social Kit)</label>
                      <div className="flex flex-wrap gap-2">
                        {['Instagram', 'Facebook', 'LinkedIn', 'TikTok'].map((platform) => (
                          <button
                            key={platform}
                            onClick={() => {
                              if (selectedPlatforms.includes(platform)) {
                                setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                              } else {
                                setSelectedPlatforms([...selectedPlatforms, platform]);
                              }
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedPlatforms.includes(platform)
                              ? 'bg-[#011a43] text-white'
                              : 'bg-gray-200 text-[#011a43] hover:bg-gray-300'
                              }`}
                          >
                            {platform}
                          </button>
                        ))}
                        <button className="px-2 py-1 rounded-full text-xs text-gray-500 border border-gray-300 hover:border-gray-400">+ Add</button>
                      </div>
                    </div>
                  )}

                 
                  {selectedProducts.includes('headshot') && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Headshot - Details</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Photo Use</label>
                          <select
                            value={photoUse}
                            onChange={(e) => setPhotoUse(e.target.value)}
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          >
                            <option value="">Select use...</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Professional website">Professional website</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Creative portfolio">Creative portfolio</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Background</label>
                          <select
                            value={headshotBackground}
                            onChange={(e) => setHeadshotBackground(e.target.value)}
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          >
                            <option value="">Select background...</option>
                            <option value="Neutral">Neutral</option>
                            <option value="Blurred office">Blurred office</option>
                            <option value="Professional setting">Professional setting</option>
                            <option value="Outdoor">Outdoor</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Style</label>
                          <select
                            value={headshotStyle}
                            onChange={(e) => setHeadshotStyle(e.target.value)}
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          >
                            <option value="">Select style...</option>
                            <option value="Formal">Formal</option>
                            <option value="Business casual">Business casual</option>
                            <option value="Creative">Creative</option>
                            <option value="Casual professional">Casual professional</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Retouch Level</label>
                          <select
                            value={retouchLevel}
                            onChange={(e) => setRetouchLevel(e.target.value)}
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          >
                            <option value="Light">Light</option>
                            <option value="Medium">Medium</option>
                            <option value="Heavy">Heavy</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProducts.includes('flyer') && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Flyer - Event Details</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Headline</label>
                          <input
                            type="text"
                            value={flyerHeadline}
                            onChange={(e) => setFlyerHeadline(e.target.value)}
                            placeholder="e.g., Grand Opening Sale"
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Date & Time</label>
                          <input
                            type="text"
                            value={eventDateTime}
                            onChange={(e) => setEventDateTime(e.target.value)}
                            placeholder="e.g., June 15, 2-5 PM"
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Location</label>
                          <input
                            type="text"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            placeholder="e.g., Downtown Mall"
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Special Offer</label>
                          <input
                            type="text"
                            value={flyerOffer}
                            onChange={(e) => setFlyerOffer(e.target.value)}
                            placeholder="e.g., 50% off entire store"
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProducts.includes('merch') && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Merch Mockup - Product Details</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Product Type</label>
                          <select
                            value={merchProductType}
                            onChange={(e) => setMerchProductType(e.target.value)}
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          >
                            <option value="">Select product...</option>
                            <option value="T-shirt">T-shirt</option>
                            <option value="Hoodie">Hoodie</option>
                            <option value="Hat">Hat</option>
                            <option value="Mug">Mug</option>
                            <option value="Tote bag">Tote bag</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Design Placement</label>
                          <select
                            value={merchPlacement}
                            onChange={(e) => setMerchPlacement(e.target.value)}
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          >
                            <option value="">Select placement...</option>
                            <option value="Front center">Front center</option>
                            <option value="Front left">Front left</option>
                            <option value="Back">Back</option>
                            <option value="Sleeve">Sleeve</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-[#011a43] mb-1">Product Color</label>
                          <input
                            type="text"
                            value={merchProductColor}
                            onChange={(e) => setMerchProductColor(e.target.value)}
                            placeholder="e.g., Black, Navy Blue, White"
                            className="w-full px-2 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedProducts.includes('businesscard') || selectedProducts.includes('flyer') || selectedProducts.includes('socialkit')) && (
                    <>
                      <label className="block text-sm font-semibold text-[#011a43] mb-3">Contact Information</label>
                      <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#011a43] mb-1">Name</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#011a43] mb-1">Title / Position</label>
                      <input
                        type="text"
                        value={contactTitle}
                        onChange={(e) => setContactTitle(e.target.value)}
                        placeholder="e.g., Founder & CEO"
                        className="w-full px-3 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#011a43] mb-1">Phone</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#011a43] mb-1">Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#011a43] mb-1">Website</label>
                      <input
                        type="url"
                        value={contactWebsite}
                        onChange={(e) => setContactWebsite(e.target.value)}
                        placeholder="www.yoursite.com"
                        className="w-full px-3 py-2 bg-white text-[#011a43] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                      />
                    </div>
                  </div>
                    </>
                  )}
                  </div>
                </div>

                <div className={`sticky top-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${(selectedProducts.includes('socialkit') || selectedProducts.includes('businesscard')) ? 'lg:top-96' : ''
                  }`}>
                  <div className="flex items-center mb-6">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="text-2xl text-[#011a43] mr-2" />
                    <h4 className="font-bold text-[#011a43]">AI Direction Preview</h4>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faFile} className="text-[#011a43] mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-[#011a43]">Requested assets</div>
                        <div className="text-gray-600 text-xs">{selectedProducts.length > 0 ? selectedProducts.map(id => products.find(p => p.id === id)?.name).join(', ') : 'Logo'}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#011a43] mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-[#011a43]">Brand summary</div>
                        <div className="text-gray-600 text-xs">{brandName || 'Your brand name'} • Premium modern brand</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faAdjust} className="text-[#011a43] mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-[#011a43]">Style directions</div>
                        <div className="text-gray-600 text-xs">Clean, premium, trustworthy</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faPencil} className="text-[#011a43] mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-[#011a43]">Colors</div>
                        <div className="flex gap-2 mt-2">
                          {selectedColors.length > 0 ? (
                            selectedColors.map((color) => (
                              <div key={color} className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: color }}></div>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">Select colors above</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faImage} className="text-[#011a43] mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-[#011a43]">Uploaded file usage</div>
                        <div className="text-gray-600 text-xs">logo sketch as inspiration, images as reference</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="font-semibold text-[#011a43]">Estimated cost:</span>
                      <span className="text-xl font-bold text-red-600">{estimatedCost} OPPAL</span>
                    </div>



                    <button
                      onClick={handleSubmit}
                      disabled={!user || isLoading || !termsAccepted}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center disabled:cursor-not-allowed gap-2"
                    >
                      <span>Generate Brand Assets</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                    </button>

                    {error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    {!user && (
                      <p className="text-sm text-gray-600 text-center mt-3">Please log in to generate assets</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !isLoadingExisting && !generatedLogos && (
          <div className="px-18 ">
            <div className=" bg-[#011a43] rounded-b-lg text-white p-10">
              <div className=" mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <FontAwesomeIcon icon={faTag} className="text-4xl text-white opacity-80" />
                  <div className="flex flex-col gap-1">

                    <div className="flex gap-3">
                      <div className="text-2xl ">Estimated Cost:</div>
                      <div className="text-2xl  text-white">{estimatedCost} OPPAL</div>
                    </div>
                    <div>
                      <div className=" ">You are creating:</div>
                      <div className="text-sm">{selectedProducts.length > 0 ? selectedProducts.map(id => products.find(p => p.id === id)?.name).join(' + ') : 'Logo'}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!user || isLoading || !termsAccepted}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  <span>Generate Brand Assets</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
        )}
        {!isLoading && !isLoadingExisting && !generatedLogos && (
          <div className="h-32"></div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto mt-12 px-4">
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
                <h2 className="text-2xl font-bold text-[#011a43] mb-4">
                  {loadingMessage || 'Generating your brands assets...'}
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

        {generatedLogos && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#011a43] mb-4">
                Your Brand Assets
              </h2>
              <p className="text-gray-600 mb-6">
                Brand: {generatedLogos.brandName} | Vibe: {generatedLogos.vibe}
              </p>
              <button
                onClick={handleStartNewProject}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Create New Project
              </button>
            </div>

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
                            <div className="absolute inset-0 grid grid-cols-2 gap-16 p-6" style={{ transform: 'rotate(-45deg) scale(1.6)' }}>
                              <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                              <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                              <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                              <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                              <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                              <div className="text-xl font-light text-white opacity-30 select-none whitespace-nowrap">1DollarLogo.com</div>
                            </div>

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
                    <h3 className="text-[#011a43] font-bold mb-2">{logo.style}</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      {logo.description}
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {logo.style.toLowerCase()}
                        </span>
                      </div>

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
                            Download
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

      {showColorPickerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#011a43] mb-6">Pick a Color</h2>

            <div className="flex flex-col items-center gap-6">
              <input
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="w-32 h-32 rounded-lg cursor-pointer border-4 border-gray-200 shadow-md"
              />

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Selected Color:</div>
                <div className="text-lg font-mono font-bold text-[#394301]">{tempColor.toUpperCase()}</div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowColorPickerModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const color = tempColor.toUpperCase();
                  if (!selectedColors.includes(color)) {
                    setSelectedColors([...selectedColors, color]);
                  }
                  setShowColorPickerModal(false);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnlockModal && selectedLogo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#011a43] mb-4">Unlock Logo</h2>

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
                className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedTier === 'Standard'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => setSelectedTier('Standard')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#011a43]">Standard</div>
                    <div className="text-sm text-gray-600">Web-ready PNG/JPG</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">10 OPPAL</div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedTier === 'Premium'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => setSelectedTier('Premium')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#011a43]">Premium</div>
                    <div className="text-sm text-gray-600">High-res + Transparency</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">20 OPPAL</div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedTier === 'Exclusive'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => setSelectedTier('Exclusive')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#011a43]">Exclusive</div>
                    <div className="text-sm text-gray-600">Vector (SVG) conversion</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">35 OPPAL</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <strong>Remaining Balance:</strong>
              <span className={`font-mono ${!isCreditsLoading && userCredits < tierCosts[selectedTier] ? 'text-red-600 font-semibold' : ''
                }`}>
                {isCreditsLoading ? '---' :
                  userCredits < tierCosts[selectedTier] ? 'N/A' :
                    userCredits - tierCosts[selectedTier]}
              </span> OPPAL

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
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${isUnlocking || isCreditsLoading || userCredits < tierCosts[selectedTier]
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
