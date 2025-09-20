
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedSection from '@/components/AnimatedSection';
import { itemVariants } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';

const CtaBanner = ({ title, subtitle, buttonText, onButtonClick, className }) => {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  function onButtonClick() {
    window.location.href = '/catalog';
  }
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <AnimatedSection as="div" className="section-wrapper !py-0">
  <div
    ref={targetRef}
    className={cn(
      "bg-gradient-to-br from-chocolate-brown via-amber-orange/30 to-chocolate-brown dark:bg-dark-surface py-24 md:py-32 relative overflow-hidden rounded-3xl shadow-2xl border border-soft-cream/40 dark:border-dark-subtle",
      className
    )}
  >
    <motion.div
      style={{ y }}
      className="absolute inset-0 bg-[repeating-linear-gradient(135deg,_#332d23_0px,_#F59E0B_2px,_transparent_2px,_transparent_20px)] opacity-20 z-0"
    />
    <div className="section-container text-center text-white relative z-10">
      <motion.h2
        variants={itemVariants}
        className="font-display text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
      >
        {title}
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.97 }}
        className="inline-block"
      >
        <button
          onClick={onButtonClick}
          className="btn-primary px-8 py-4 text-lg font-bold rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-amber-orange/90 focus:outline-none focus:ring-2 focus:ring-amber-orange"
        >
          {buttonText}
        </button>
      </motion.div>
    </div>
  </div>
</AnimatedSection>
  );
};

export default CtaBanner;
