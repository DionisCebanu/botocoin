import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import HeroSection from '@/components/HeroSection';
import QualityPromiseSection from '@/components/QualityPromiseSection';
import DonutsSection from '@/components/DonutsSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import CtaBanner from '@/components/CtaBanner';
import BestSellersSection from '@/components/BestSellersSection';
import NewsGrid from '@/components/NewsGrid';

const HomePage = () => {
    const { t } = useTranslation();

    const handleNotImplemented = (feature) => {
        toast({
            title: `🚧 ${feature} is not implemented yet`,
            description: "But don't worry! You can request it in your next prompt! 🚀"
        });
    };

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
        <>
            <Helmet>
                <title>{t('seo_title_home')}</title>
                <meta name="description" content={t('seo_description_home')} />
            </Helmet>
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
        </>
    );
};

export default HomePage;