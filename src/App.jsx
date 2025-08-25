import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import FloatingDonuts from '@/components/FloatingDonuts';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNotImplemented = (feature) => {
    toast({
      title: `🚧 ${feature} is not implemented yet`,
      description: "But don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleSocialClick = (social) => handleNotImplemented(`${social} Link`);
  const handleCallClick = () => handleNotImplemented("Phone Call");
  const handleOrderClick = (item) => handleNotImplemented(`Order for ${item || 'item'}`);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-soft-cream dark:bg-dark-bg transition-colors duration-500">
        <FloatingDonuts />
        <Navbar 
          onSocialClick={handleSocialClick} 
          onCallClick={handleCallClick}
          onOrderClick={() => handleOrderClick(t('nav_order'))}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Routes>
        <Footer onSocialClick={handleSocialClick} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;