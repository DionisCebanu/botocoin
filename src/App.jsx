
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import QualityPromiseSection from '@/components/QualityPromiseSection';
import DonutsSection from '@/components/DonutsSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import CtaBanner from '@/components/CtaBanner';
import BestSellersSection from '@/components/BestSellersSection';
import FloatingDonuts from '@/components/FloatingDonuts';
import NewsGrid from '@/components/NewsGrid';

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleNotImplemented = (feature) => {
    toast({
      title: `🚧 ${feature} is not implemented yet`,
      description: "But don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleSocialClick = (social) => handleNotImplemented(`${social} Link`);
  const handleCallClick = () => handleNotImplemented("Phone Call");
  const handleOrderClick = (item) => handleNotImplemented(`Order for ${item || 'item'}`);
  const handleMenuClick = (menu) => handleNotImplemented(`Menu ${menu}`);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    handleNotImplemented("Contact Form");
    toast({
      title: "✅ Message sent!",
      description: "Thanks, we'll get back to you soon."
    });
  };
  const handleGalleryClick = () => handleNotImplemented("Full Gallery");
  const handleReadMoreClick = (title) => handleNotImplemented(`Read more on: ${title}`);


  return (
    <BrowserRouter>
      <ThemeProvider>
        <Helmet>
          <title>{t('Botocoin')}</title>
          <meta name="description" content={t('seo_description')} />
          <meta name="keywords" content={t('seo_keywords')} />
          <meta property="og:title" content={t('og_title')} />
          <meta property="og:description" content={t('og_description')} />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://lebotocoin.com" />
        </Helmet>
        <div className="relative min-h-screen bg-soft-cream dark:bg-dark-bg transition-colors duration-500">
          <FloatingDonuts />
          <Navbar
            onSocialClick={handleSocialClick}
            onCallClick={handleCallClick}
            onOrderClick={() => handleOrderClick(t('nav_order'))}
          />
          <main>
            <HeroSection onOrderClick={handleOrderClick} onMenuClick={handleMenuClick}/>
            <BestSellersSection onOrderClick={handleOrderClick} />
            <DonutsSection onOrderClick={handleOrderClick} />
            <QualityPromiseSection />
            <CtaBanner
              title={t('cta_banner_title')}
              subtitle={t('cta_banner_subtitle')}
              buttonText={t('cta_banner_button')}
              onButtonClick={() => handleOrderClick(t('cta_banner_button'))}
            />
            <NewsGrid onReadMore={handleReadMoreClick} />
            <GallerySection onViewAllClick={handleGalleryClick} />
            <TestimonialsSection />
            <ContactSection onFormSubmit={handleFormSubmit} />
          </main>
          <Footer onSocialClick={handleSocialClick} />
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
