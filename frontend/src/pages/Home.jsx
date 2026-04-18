import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ExamplesGallery from '../components/ExamplesGallery'
import Pricing from '../components/Pricing'
import WebsiteBundle from '../components/WebsiteBundle'
import OfferTiers from '../components/OfferTiers'
import FAQ from '../components/FAQ'
// import Contact from '../components/Contact' // Moved to dedicated ContactPage

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <ExamplesGallery />
      <Pricing />
      <WebsiteBundle />
      <OfferTiers />
      <FAQ />
    </div>
  );
};

export default Home;
