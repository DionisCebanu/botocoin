
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';

const DonutsSection = ({ onOrderClick }) => {
  const { t } = useTranslation();
  const donuts = t('donuts_items', { returnObjects: true });

  return (
    <AnimatedSection as="section" id="donuts" className="section-wrapper bg-white dark:bg-dark-surface">
      <div className="section-container text-center">
        <motion.h2 variants={itemVariants} className="section-title">{t('donuts_title')}</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-16">
          {t('donuts_subtitle')}
        </motion.p>
        <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {donuts.map((donut, index) => (
            <motion.div
              key={donut.name}
              variants={itemVariants}
              className="bg-soft-cream dark:bg-dark-bg rounded-2xl shadow-soft overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-2 flex flex-col"
            >
              <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                <img 
                  alt={donut.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                  src={`/img/donuts/hero-${index + 1}.png`} 
                  loading="lazy"/>
              </div>
              <div className="p-6 text-left flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-display text-chocolate-brown dark:text-soft-cream">{donut.name}</h3>
                <p className="text-warm-gray mt-2 mb-6 flex-grow">{donut.description}</p>
                <button onClick={() => onOrderClick(donut.name)} className="w-full btn-secondary text-sm py-3 mt-auto">
                  {t('add_to_cart_button')}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default DonutsSection;
