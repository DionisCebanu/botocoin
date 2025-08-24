import React from 'react';
import { motion } from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { containerCardsVariants, itemCardsVariants, itemVariants } from '@/lib/animations';
import DonutCard from '@/cards/DonutCard';

const DonutsSection = ({ onOrderClick }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // recompute list when language changes
  const donuts = React.useMemo(
    () => t('donuts_items', { returnObjects: true }) || [],
    [i18n.language] // <- key dependency
  );


  return (
    <AnimatedSection as="section" id="donuts" className="section-wrapper bg-white dark:bg-dark-surface">
      <div className="section-container text-center">
        <motion.h2 variants={itemVariants} className="section-title section-title-underline">
          {t('donuts_title')}
        </motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-12">
          {t('donuts_subtitle')}
        </motion.p>

        <motion.ul
          key={`donuts-${i18n.language}`}  // <- force remount when lang changes
          variants={containerCardsVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {donuts.map((donut, index) => (
            <DonutCard
              key={`${donut.name}-${index}`}
              variants={itemCardsVariants}
              name={donut.name}
              description={donut.description}
              imageSrc={`/img/donuts/hero-${index + 1}.png`}
              ctaLabel={t('add_to_cart_button')}
              onOrder={() => onOrderClick(donut.name)}
            />
          ))}
        </motion.ul>


        {/* View all (catalog) */}
        <motion.div variants={itemVariants} className="mt-12">
            <button 
                onClick={() => navigate('/catalog')}
                className="btn-secondary"
            >
                {t('view_full_catalog_button')}
            </button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default DonutsSection;
