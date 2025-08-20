
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import { ArrowRight } from 'lucide-react';

const NewsGrid = ({ onReadMore }) => {
  const { t } = useTranslation();
  const newsItems = t('news_items', { returnObjects: true });

  return (
    <AnimatedSection as="section" id="news" className="section-wrapper bg-white dark:bg-dark-surface">
      <div className="section-container text-center">
        <motion.h2 variants={itemVariants} className="section-title">{t('news_title')}</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-16">
          {t('news_subtitle')}
        </motion.p>
        <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {newsItems.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="bg-soft-cream dark:bg-dark-bg rounded-2xl shadow-soft overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-2 flex flex-col text-left"
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                  src={`/img/news/news-${index + 1}.png`}
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center text-sm text-warm-gray mb-2">
                    <span className="font-semibold text-amber-orange">{item.category}</span>
                    <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold font-display text-chocolate-brown dark:text-soft-cream mb-3 flex-grow">{item.title}</h3>
                <p className="text-warm-gray mb-6">{item.excerpt}</p>
                <button 
                  onClick={() => onReadMore(item.title)} 
                  className="font-semibold text-amber-orange hover:text-yellow-600 self-start group/link flex items-center gap-2"
                >
                  {item.read_more}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default NewsGrid;
