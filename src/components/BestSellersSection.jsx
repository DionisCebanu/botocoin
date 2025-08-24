import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslation } from 'react-i18next';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { itemVariants, containerVariants } from '@/lib/animations';
import NavWave from './ui/NavWave';

const BestSellersSection = ({ onOrderClick }) => {
  const { t } = useTranslation();
  const bestSellers = t('bestsellers_items', { returnObjects: true });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <>
      {/* The section itself (no wave inside) */}
      <AnimatedSection
        as="section"
        id="bestsellers"
        className="section-wrapper bg-soft-cream dark:bg-dark-bg"
      >
        <div className="section-container">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="section-title section-title-underline">
              {t('bestsellers_title')}
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div variants={itemVariants} className="embla -mx-4" ref={emblaRef}>
              <motion.div variants={containerVariants} className="embla__container ml-4">
                {bestSellers.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    className="embla__slide flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_40%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] min-w-0 pr-4"
                  >
                    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-soft overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                          src={`/img/bestseller/hero-${index + 1}.png`}
                          loading="lazy"
                        />
                        {item.discount && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            {item.discount}
                          </div>
                        )}
                      </div>
                      <div className="p-5 text-left flex flex-col flex-grow">
                        <p className="text-xs text-warm-gray uppercase tracking-wider">
                          {item.category}
                        </p>
                        <h3 className="text-xl font-bold font-display text-chocolate-brown dark:text-soft-cream my-2">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-2 my-2">
                          <div className="flex">
                            {[...Array(Math.max(0, Math.min(5, Number.isFinite(item.rating) ? Math.floor(item.rating) : 0)))].map((_, i) => (
                              <Star key={i} size={16} className="text-amber-orange fill-current" />
                            ))}
                            {[...Array(5 - Math.max(0, Math.min(5, Number.isFinite(item.rating) ? Math.floor(item.rating) : 0)))].map((_, i) => (
                              <Star key={i} size={16} className="text-amber-orange/30" />
                            ))}
                          </div>
                          <span className="text-sm text-warm-gray">({item.rating}.0)</span>
                        </div>

                        <div className="mt-auto pt-4 flex justify-between items-center">
                          <p className="text-xl font-bold text-chocolate-brown dark:text-soft-cream">
                            {item.price}
                          </p>
                          <button
                            onClick={() => onOrderClick(item.name)}
                            className="btn-primary py-2 px-5 text-sm"
                          >
                            {t('order_button')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <div className="hidden lg:block">
              <button
                onClick={scrollPrev}
                aria-label="Previous best seller"
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-dark-surface/80 shadow-md hover:scale-110 transition-all"
              >
                <ArrowLeft className="h-6 w-6 text-chocolate-brown dark:text-soft-cream" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next best seller"
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-dark-surface/80 shadow-md hover:scale-110 transition-all"
              >
                <ArrowRight className="h-6 w-6 text-chocolate-brown dark:text-soft-cream" />
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* The divider wave lives OUTSIDE the section, so it "exits" it */}
      <div aria-hidden className="relative bottom-[-40px] z-30">
        {/* Set these colors to the NEXT section’s background for a seamless transition */}
        <NavWave className="block w-full h-6 md:h-10 bottom-[-40px] text-soft-cream dark:text-dark-bg opacity-90" />
      </div>
    </>
  );
};

export default BestSellersSection;
