import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import allProducts from '@/data/allProducts.json';
import ProductCard from '@/components/catalog/ProductCard';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';

const RelatedProducts = ({ currentItemId, category }) => {
    const { t } = useTranslation();

    const relatedItems = useMemo(() => {
        return allProducts
            .filter(p => p.cat === category && p.id !== currentItemId)
            .sort(() => 0.5 - Math.random()) // Randomize
            .slice(0, 4);
    }, [currentItemId, category]);

    if (relatedItems.length === 0) return null;

    return (
        <AnimatedSection as="div" className="section-wrapper bg-white dark:bg-dark-surface">
            <div className="section-container">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold font-display text-center mb-12">{t('product_details_related_title')}</motion.h2>
                <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {relatedItems.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

export default RelatedProducts;