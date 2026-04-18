import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-purple-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Logo Design for
            <span className="text-purple-600"> Just $1</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get stunning, custom-designed logos that make your brand stand out. 
            Powered by AI, perfected by designers.
          </p>
          <Link 
            to="/generate"
            className="inline-block bg-purple-600 hover:bg-purple-700 focus:bg-purple-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 focus:scale-105 shadow-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Start Free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
