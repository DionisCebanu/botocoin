
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Leaf, Award, Users } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';

const icons = [Leaf, Award, Users];

const QualityPromiseSection = () => {
  const { t } = useTranslation();
  const features = t('quality_items', { returnObjects: true });

  return (
    <AnimatedSection as="section" id="quality" className="section-wrapper bg-soft-cream dark:bg-dark-bg">
      <div className="section-container text-center">
        <motion.h2 variants={itemVariants} className="section-title">{t('quality_title')}</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-16">
          {t('quality_subtitle')}
        </motion.p>
        <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <motion.div key={feature.title} variants={itemVariants} className="flex flex-col items-center p-8 bg-white dark:bg-dark-surface rounded-2xl shadow-soft">
                <div className="flex-shrink-0 w-24 h-24 bg-green-leaf text-white rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                  <Icon size={42} />
                </div>
                <h3 className="text-2xl font-bold font-display text-chocolate-brown dark:text-soft-cream mb-3">{feature.title}</h3>
                <p className="text-warm-gray leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default QualityPromiseSection;
