import { useState } from 'react';

// Gallery data with 17 new logos from public folder
const galleryData = [
  {
    id: 1,
    title: 'TechStart',
    category: 'Tech',
    imageUrl: '/Logo1 (1).png',
    description: 'Innovative tech startup'
  },
  {
    id: 2,
    title: 'Creams Cafe',
    category: 'Food',
    imageUrl: '/Logo1 (2).png',
    description: 'Artisan coffee shop'
  },
  {
    id: 3,
    title: 'Kaes',
    category: 'Fashion',
    imageUrl: '/Logo1 (3).png',
    description: 'Modern fashion brand'
  },
  {
    id: 4,
    title: 'MediCare Plus',
    category: 'Health',
    imageUrl: '/Logo1 (4).png',
    description: 'Healthcare service'
  },
  {
    id: 5,
    title: 'CloudSync Pro',
    category: 'Tech',
    imageUrl: '/Logo1 (5).png',
    description: 'Cloud platform'
  },
  {
    id: 6,
    title: 'Green Harvest',
    category: 'Food',
    imageUrl: '/Logo1 (6).png',
    description: 'Organic farming'
  },
  {
    id: 7,
    title: 'Elegance Wear',
    category: 'Fashion',
    imageUrl: '/Logo1 (7).png',
    description: 'Luxury apparel'
  },
  {
    id: 8,
    title: 'Wellness Hub',
    category: 'Health',
    imageUrl: '/Logo1 (8).png',
    description: 'Wellness center'
  },
  {
    id: 9,
    title: 'DataFlow',
    category: 'Tech',
    imageUrl: '/Logo1 (9).png',
    description: 'Data analytics'
  },
  {
    id: 10,
    title: 'Bistro Fresh',
    category: 'Food',
    imageUrl: '/Logo1 (10).png',
    description: 'Fresh cuisine'
  },
  {
    id: 11,
    title: 'StyleCraft',
    category: 'Fashion',
    imageUrl: '/Logo1 (11).png',
    description: 'Fashion design'
  },
  {
    id: 12,
    title: 'HealthFirst',
    category: 'Health',
    imageUrl: '/Logo1 (12).png',
    description: 'Medical care'
  },
  {
    id: 13,
    title: 'CodeMaster',
    category: 'Tech',
    imageUrl: '/Logo1 (13).png',
    description: 'Development tools'
  },
  {
    id: 14,
    title: 'Taste Haven',
    category: 'Food',
    imageUrl: '/Logo1 (14).png',
    description: 'Gourmet experience'
  },
  {
    id: 15,
    title: 'Chic Style',
    category: 'Fashion',
    imageUrl: '/Logo1 (15).png',
    description: 'Fashion boutique'
  },
  {
    id: 16,
    title: 'CarePlus',
    category: 'Health',
    imageUrl: '/Logo1 (16).png',
    description: 'Healthcare services'
  },
  {
    id: 17,
    title: 'TechNova',
    category: 'Tech',
    imageUrl: '/Logo1 (17).png',
    description: 'Tech innovation'
  }
];

const categories = ['All', 'Tech', 'Food', 'Fashion', 'Health'];

const ExamplesGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredData, setFilteredData] = useState(galleryData);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    
    if (category === 'All') {
      setFilteredData(galleryData);
    } else {
      setFilteredData(galleryData.filter(item => item.category === category));
    }
  };

  // Get first 6 items from filtered data
  const displayItems = filteredData.slice(0, 6);


  return (
    <section id="examples" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1d37] mb-4">
            Real Brands, Generated in Seconds.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See what founders can create with a simple prompt and the right identity engine.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 border ${
                activeFilter === category
                  ? 'bg-[#0a1d37] text-white border-[#0a1d37]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Static 6 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              {/* Logo Image */}
              <div className="aspect-square relative bg-gray-50 p-4">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Card Content */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{item.title}</h3>
                <button className="w-full py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors duration-200">
                  View Brand Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamplesGallery;
