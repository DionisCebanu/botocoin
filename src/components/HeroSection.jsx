import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

const HeroSection = ({ onOrderClick, onMenuClick }) => {
  const { t } = useTranslation();
  const slides = t('hero_slides', { returnObjects: true });

  const [isPlaying, setIsPlaying] = useState(true);
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const togglePlay = useCallback(() => {
    if (!emblaApi || !autoplay.current) return;
    const player = autoplay.current.player;
    if (player.isPlaying) player.stop();
    else player.play();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplay.current) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onAutoplayChange = () => setIsPlaying(autoplay.current.player.isPlaying);

    emblaApi.on('select', onSelect);
    emblaApi.on('autoplay:play', onAutoplayChange);
    emblaApi.on('autoplay:stop', onAutoplayChange);
    onSelect();

    return () => {
      emblaApi?.off('select', onSelect);
      emblaApi?.off('autoplay:play', onAutoplayChange);
      emblaApi?.off('autoplay:stop', onAutoplayChange);
    };
  }, [emblaApi]);

  return (
    <section className="relative h-[100svh] md:h-[90svh] overflow-hidden bg-chocolate-brown">
      {/* Embla root: NOT flex */}
      <div className="embla h-full w-full overflow-hidden" ref={emblaRef}>
        {/* Container is flex */}
        <div className="embla__container flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="embla__slide relative h-full flex-[0_0_100%] min-w-0 overflow-hidden"
            >
              {/* Absolute image fills slide; slide is relative + has concrete height */}
              <img
                alt={slide.headline}
                src={`/img/promo/hero-${index + 1}.png`}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-60 z-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay & content are above the image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20 z-10 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pt-24 z-20">
        <div className="text-center text-white p-6 sm:p-8 max-w-4xl mx-auto">
          {slides.map((slide, index) => (
            <div key={index} style={{ display: selectedIndex === index ? 'block' : 'none' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <p className="font-semibold text-amber-orange tracking-widest uppercase mb-3 sm:mb-4">
                  {t('hero_promo_badge', { index: index + 1 })}
                </p>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight w-[70%] mx-auto sm:w-full"
              >
                {slide.headline}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl max-w-xl mx-auto"
              >
                {slide.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
                className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
              >
                <button onClick={() => onOrderClick(slide.cta1)} className="btn-primary">
                  {slide.cta1}
                </button>
                <button
                  onClick={() => onMenuClick(slide.cta2)}
                  className="btn-secondary !text-white !border-white/80 hover:!bg-white hover:!text-chocolate-brown"
                >
                  {slide.cta2}
                </button>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white z-30"
      >
        <ArrowLeft size={28} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white z-30"
      >
        <ArrowRight size={28} />
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-30 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              selectedIndex === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause slider' : 'Play slider'}
          className="ml-2 sm:ml-4 text-white/80 hover:text-white"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
