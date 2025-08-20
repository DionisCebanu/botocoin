
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';

const imageLayouts = [
  { className: "md:row-span-2", src: "/img/gallery/hero-1.png" },
  { className: "md:col-span-2", src: "/img/gallery/hero-2.png" },
  { className: "md:row-span-2", src: "/img/gallery/hero-3.png" },
  { className: "md:col-span-2", src: "/img/gallery/hero-4.png" },
  { className: "md:col-span-2", src: "/img/gallery/hero-5.png" },
  { className: "md:col-span-2", src: "/img/gallery/hero-6.png" },
];

const GallerySection = ({ onViewAllClick }) => {
    const { t } = useTranslation();
    const images = t('gallery_images', { returnObjects: true });

    return (
        <AnimatedSection as="section" id="gallery" className="section-wrapper bg-white dark:bg-dark-surface">
            <div className="section-container text-center">
                <motion.h2 variants={itemVariants} className="section-title">{t('gallery_title')}</motion.h2>
                <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-16">
                    {t('gallery_subtitle')}
                </motion.p>
                <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4"
                >
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`relative overflow-hidden rounded-2xl group shadow-soft ${imageLayouts[index].className}`}
                        >
                            <img 
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                src={imageLayouts[index].src} 
                                loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <p className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.alt}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div variants={itemVariants} className="mt-12">
                    <button onClick={onViewAllClick} className="btn-secondary">
                        {t('gallery_button')}
                    </button>
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

export default GallerySection;
