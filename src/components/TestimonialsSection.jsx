
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslation } from 'react-i18next';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import Autoplay from 'embla-carousel-autoplay';
import { itemVariants } from '@/lib/animations';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = t('testimonials_items', { returnObjects: true });
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <AnimatedSection as="section" id="testimonials" className="section-wrapper bg-white dark:bg-dark-surface">
      <div className="section-container text-center">
        <motion.h2 variants={itemVariants} className="section-title">{t('testimonials_title')}</motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-12">
          {t('testimonials_subtitle')}
        </motion.p>
        <motion.div variants={itemVariants} className="relative">
            <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container">
                {testimonials.map((testimonial, index) => (
                <div className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 px-4" key={index}>
                    <div className="bg-soft-cream dark:bg-dark-bg p-8 rounded-2xl shadow-soft h-full flex flex-col justify-center text-center">
                    <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-amber-orange fill-current" />)}
                    </div>
                    <blockquote className="text-warm-gray italic text-lg mb-6 flex-grow">"{testimonial.quote}"</blockquote>
                    <p className="font-bold text-chocolate-brown dark:text-soft-cream">- {testimonial.author}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
            <div className="hidden md:block">
                <button onClick={scrollPrev} aria-label="Previous testimonial" className="absolute left-0 top-1/2 -translate-x-full p-2 rounded-full bg-white/80 dark:bg-dark-surface/80 shadow-md hover:scale-110 transition-all">
                    <ArrowLeft className="h-6 w-6 text-chocolate-brown dark:text-soft-cream" />
                </button>
                <button onClick={scrollNext} aria-label="Next testimonial" className="absolute right-0 top-1/2 translate-x-full p-2 rounded-full bg-white/80 dark:bg-dark-surface/80 shadow-md hover:scale-110 transition-all">
                    <ArrowRight className="h-6 w-6 text-chocolate-brown dark:text-soft-cream" />
                </button>
            </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default TestimonialsSection;
