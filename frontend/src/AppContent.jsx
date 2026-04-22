import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GenerateLogo from './pages/GenerateLogo';
import Generate from './pages/Generate';
import Contact from './components/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      {/* Only show Navbar if not on admin routes */}
      {!isAdminPath && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<GenerateLogo />} />
          <Route path="/generate-old" element={<Generate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        </Routes>
      </main>
      
      {/* Only show Footer if not on admin routes */}
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default AppContent;
