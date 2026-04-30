import Hero from '../components/Hero'
import ComparisonSection from '../components/ComparisonSection'
import HowItWorks from '../components/HowItWorks'
import ExamplesGallery from '../components/ExamplesGallery'
import Pricing from '../components/Pricing'
import WebsiteBundle from '../components/WebsiteBundle'
import OfferTiers from '../components/OfferTiers'
import VisualDivider from '../components/VisualDivider'
// import Contact from '../components/Contact' // Moved to dedicated ContactPage

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ComparisonSection />
      <HowItWorks />
      <ExamplesGallery />
      <div id="pricing-section">
        <Pricing />
      </div>
      <WebsiteBundle />
      <OfferTiers />
      <VisualDivider />
    </div>
  );
};

export default Home;
