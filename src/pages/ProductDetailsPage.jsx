
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Frown } from 'lucide-react';
import allProducts from '@/data/allProducts.json';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import ImageGallery from '@/components/details/ImageGallery';
import AddToCartBar from '@/components/details/AddToCartBar';
import Breadcrumbs from '@/components/details/Breadcrumbs';
import RelatedProducts from '@/components/details/RelatedProducts';
import ProductInfo from '@/components/details/ProductInfo';
import NavWave from '../components/ui/NavWave';
import { Button } from '@/components/ui/button';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const product = allProducts.find(p => String(p.id) === id);
            setItem(product);
            setLoading(false);
        }, 300); 
    }, [id]);

    const handleBackToResults = () => {
        navigate(`/catalog${location.state?.from || ''}`);
    };

    if (loading) {
        return (
            <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
                <div className="section-container pb-24">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-12"></div>
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                            <div>
                                <div className="aspect-[4/3] bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                                <div className="flex gap-4 mt-4">
                                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                                <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!item) {
        return (
            <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
                <div className="section-container text-center flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
                    <Frown className="h-24 w-24 text-amber-orange" />
                    <h1 className="section-title mt-8">{t('product_details_not_found_title')}</h1>
                    <p className="section-subtitle mt-4 mx-auto">{t('product_details_not_found_desc')}</p>
                    <Button asChild className="mt-8">
                        <Link to="/catalog">{t('product_details_back_to_catalog')}</Link>
                    </Button>
                </div>
            </div>
        );
    }
    
    const breadcrumbItems = [
        { label: t('breadcrumbs_home'), href: '/' },
        { label: t('nav_catalog'), href: '/catalog' },
        { label: t(`catalog_gate_${item.cat}`), href: `/catalog?cat=${item.cat}` },
        { label: item.title }
    ];

    const productJsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": item.title,
      "image": item.images ? item.images[0] : item.img,
      "description": item.description,
      "brand": {
        "@type": "Brand",
        "name": "Le Botocoin"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "CAD",
        "price": item.price.toFixed(2),
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": item.rating,
        "reviewCount": item.reviewCount || Math.floor(Math.random() * 50) + 5
      }
    };

    return (
        <>
            <Helmet>
                <title>{item.title} - Le Botocoin</title>
                <meta name="description" content={item.description} />
                <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
            </Helmet>
            <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
                <AnimatedSection as="div" className="section-container pb-24">
                    <motion.div variants={containerVariants}>
                        <motion.button 
                            variants={itemVariants} 
                            onClick={handleBackToResults} 
                            className="flex items-center gap-2 font-semibold text-warm-gray hover:text-chocolate-brown dark:hover:text-soft-cream transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('product_details_back_to_results')}
                        </motion.button>
                        <motion.div variants={itemVariants}>
                            <Breadcrumbs items={breadcrumbItems} />
                        </motion.div>

                        <div className="mt-8 grid md:grid-cols-2 gap-12 lg:gap-20">
                            <motion.div variants={itemVariants}>
                                <ImageGallery images={item.images || [item.img]} alt={item.title} />
                            </motion.div>
                            <motion.div variants={itemVariants} className="sticky top-28 h-fit">
                                <ProductInfo item={item} />
                                <AddToCartBar item={item} />
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatedSection>
                {/* The divider wave lives OUTSIDE the section, so it "exits" it */}
                <div aria-hidden className="relative bottom-[-20px] sm:bottom-[-40px] z-30">
                    {/* Set these colors to the NEXT section’s background for a seamless transition */}
                    <NavWave className="block w-full h-6 md:h-10 bottom-[-40px] text-soft-cream dark:text-dark-bg opacity-90" />
                </div>
                
                <RelatedProducts currentItemId={item.id} category={item.cat} />
            </div>
        </>
    );
};

export default ProductDetailsPage;
