
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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
      if (emblaApi) {
        emblaApi.off('select', onSelect);
        emblaApi.off('autoplay:play', onAutoplayChange);
        emblaApi.off('autoplay:stop', onAutoplayChange);
      }
    };
  }, [emblaApi]);
  
  return (
    <section ref={targetRef} className="relative h-[110vh] -mt-24 overflow-hidden bg-chocolate-brown">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container h-full">
          {slides.map((slide, index) => (
            <div className="embla__slide relative" key={index}>
              <motion.div style={{ y: imageY, scale: imageScale }} className="h-full w-full">
                <img 
                  alt={slide.headline}
                  className="w-full h-full object-cover opacity-60"
                  src={`/img/promo/hero-${index + 1}.png`} 
                  fetchpriority="high"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20" />
      <div className="absolute inset-0 flex items-center justify-center pt-24">
        <div className="text-center text-white p-8 max-w-4xl mx-auto overflow-hidden">
          {slides.map((slide, index) => (
            <div key={index} style={{ display: selectedIndex === index ? 'block' : 'none' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                 <p className="font-semibold text-amber-orange tracking-widest uppercase mb-4">{t('hero_promo_badge', { index: index + 1 })}</p>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="font-display text-5xl md:text-7xl font-bold"
              >
                {slide.headline}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className="mt-4 text-lg md:text-xl max-w-xl mx-auto"
              >
                {slide.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
                className="flex justify-center gap-4 mt-8"
              >
                <button onClick={() => onOrderClick(slide.cta1)} className="btn-primary">{slide.cta1}</button>
                <button onClick={() => onMenuClick(slide.cta2)} className="btn-secondary !text-white !border-white/80 hover:!bg-white hover:!text-chocolate-brown">{slide.cta2}</button>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} aria-label="Previous slide" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white z-10">
        <ArrowLeft size={28} />
      </button>
      <button onClick={scrollNext} aria-label="Next slide" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white z-10">
        <ArrowRight size={28} />
      </button>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10 items-center">
        {slides.map((_, index) => (
          <button key={index} onClick={() => scrollTo(index)} aria-label={`Go to slide ${index + 1}`} className={`w-3 h-3 rounded-full transition-all ${selectedIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`} />
        ))}
         <button onClick={togglePlay} aria-label={isPlaying ? 'Pause slider' : 'Play slider'} className="ml-4 text-white/80 hover:text-white">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
