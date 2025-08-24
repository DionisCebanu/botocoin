import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { containerCardsVariants, itemCardsVariants, itemVariants } from '@/lib/animations';

const DonutsSection = ({ onOrderClick }) => {
  const { t } = useTranslation();
  const donuts = t('donuts_items', { returnObjects: true }) || [];

  return (
    <AnimatedSection
      as="section"
      id="donuts"
      className="section-wrapper bg-white dark:bg-dark-surface"
    >
      <div className="section-container text-center">
         <motion.h2 variants={itemVariants} className="section-title">{t('donuts_title')}</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-16">
            {t('donuts_subtitle')}
          </motion.p>

        <motion.ul
          variants={containerCardsVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {donuts.map((donut, index) => (
            <motion.li key={donut.name} variants={itemCardsVariants} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-soft-cream/70 dark:bg-dark-bg ring-1 ring-brown/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {/* Image wrapper : même ratio partout */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={`/img/donuts/hero-${index + 1}.png`}
                    alt={donut.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg md:text-xl font-semibold font-display text-chocolate-brown dark:text-soft-cream">
                    {donut.name}
                  </h3>
                  <p className="mt-2 text-sm text-warm-gray md:text-base line-clamp-2">
                    {donut.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => onOrderClick(donut.name)}
                      className="w-full btn-secondary py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
                    >
                      {t('add_to_cart_button')}
                    </button>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </AnimatedSection>
  );
};

export default DonutsSection;
