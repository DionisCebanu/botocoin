import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslation } from 'react-i18next';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { itemVariants, containerVariants } from '@/lib/animations';
import NavWave from './ui/NavWave';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://event-api.dioniscode.com/public/api';
const DEBUG = true;

const BestSellersSection = ({ onOrderClick }) => {
  console.log('BestSellersSection render');
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    containScroll: 'trimSnaps',
  });

  useEffect(() => {
    let alive = true;
    const url = new URL(`${API_BASE}/bestsellers`);
    url.searchParams.set('lang', i18n.language || 'en');

    if (DEBUG) {
      console.groupCollapsed('%c[BestSellers] fetch', 'color:#8b5cf6;font-weight:bold;');
      console.log('URL:', url.toString());
      console.log('lang:', i18n.language);
    }

    fetch(url.toString())
      .then(async (res) => {
        if (DEBUG) console.log('HTTP', res.status, res.statusText);
        if (!res.ok) {
          const txt = await res.text().catch(() => '(no body)');
          if (DEBUG) console.log('Body (error):', txt);
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!alive) return;
        if (DEBUG) {
          console.log('Raw JSON:', json);
          console.log('meta:', json?.meta);
          console.log('data length:', Array.isArray(json?.data) ? json.data.length : 'n/a');
          if (Array.isArray(json?.data) && json.data.length) {
            console.log('sample item:', json.data[0]);
          }
        }

        const arr = Array.isArray(json?.data) ? json.data : [];
        const mapped = arr.map((p) => {
          const tl = p.translated || {};
          return {
            id: p.id,
            title: tl.title || p.title,
            description: tl.description || p.description,
            category: p.category?.slug || '',
            price: Number(p.price ?? 0),
            rating: p.rating == null ? 4 : Number(p.rating),
            img: p.coverUrl || (p.images?.[0]?.url) || p.image_url || '/img/promo/hero-2.png',
            discount: p.bestseller?.discount_text || null,
            _raw: p,
          };
        });

        if (DEBUG) console.log('mapped items:', mapped);
        setItems(mapped);
      })
      .catch((err) => {
        if (!alive) return;
        if (DEBUG) console.error('[BestSellers] fetch error:', err);
        setItems([]);
      })
      .finally(() => {
        if (DEBUG) console.groupEnd();
      });

    return () => { alive = false; };
  }, [i18n.language]);

  useEffect(() => {
    if (DEBUG) {
      console.log('[BestSellers] emblaApi ready?', !!emblaApi);
      console.log('[BestSellers] items length:', items.length);
    }
  }, [emblaApi, items.length]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Instead of returning null, show a tiny debug placeholder if empty
  if (!items.length) {
    return (
      <AnimatedSection as="section" id="bestsellers" className="section-wrapper bg-soft-cream dark:bg-dark-bg">
        <div className="section-container text-center">
          <p className="text-warm-gray">
            {t('bestsellers_title')} — no items yet.
          </p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <>
      <AnimatedSection as="section" id="bestsellers" className="section-wrapper bg-soft-cream dark:bg-dark-bg">
        <div className="section-container">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="section-title section-title-underline">
              {t('bestsellers_title')}
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div variants={itemVariants} className="embla -mx-4" ref={emblaRef}>
              <motion.div variants={containerVariants} className="embla__container ml-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="embla__slide flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_40%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] min-w-0 pr-4"
                  >
                    <div className="bg-white dark:bg-dark-surface rounded-3xl border border-soft-cream/60 dark:border-dark-subtle group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] flex flex-col h-full">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                          src={item.img}
                          loading="lazy"
                        />
                        {item.discount && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            {item.discount}
                          </div>
                        )}
                      </div>
                      <div className="p-5 text-left flex flex-col flex-grow">
                        <p className="text-xs text-warm-gray uppercase tracking-wider">{item.category}</p>
                        <h3 className="text-xl font-bold font-display text-chocolate-brown dark:text-soft-cream my-2">
                          {item.title}
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
                          <span className="text-sm text-warm-gray">({(Number(item.rating) || 0).toFixed(1)})</span>
                        </div>

                        <div className="mt-auto pt-4 flex justify-between items-center">
                          <p className="text-xl font-bold text-chocolate-brown dark:text-soft-cream">
                            ${item.price.toFixed(2)}
                          </p>
                          <button
                            onClick={() => window.location.href = `/details/${item.id}` || '#'}
                            className="btn-primary py-2 px-5 text-sm"
                          >
                            {t('order_button')} +
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

      <div aria-hidden className="relative bottom-[-20px] sm:bottom-[-40px] z-30">
        <NavWave className="block w-full h-6 md:h-10 bottom-[-40px] text-soft-cream dark:text-dark-bg opacity-90" />
      </div>
    </>
  );
};

export default BestSellersSection;
