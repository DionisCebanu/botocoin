
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedSection from '@/components/AnimatedSection';
import { itemVariants } from '@/lib/animations';

const CtaBanner = ({ title, subtitle, buttonText, onButtonClick, className }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <AnimatedSection as="div" className="section-wrapper !py-0">
        <div ref={targetRef} className={cn("bg-chocolate-brown dark:bg-dark-surface py-24 md:py-32 relative overflow-hidden", className)}>
            <motion.div 
                style={{ y }}
                className="absolute inset-0 bg-[url('public/img/sprinkles.svg')] opacity-10 bg-repeat z-0"
            />
            <div className="section-container text-center text-white relative z-10">
            <motion.h2 variants={itemVariants} className="font-display text-4xl md:text-5xl font-bold mb-4">{title}</motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-soft-cream/80 mb-8 max-w-2xl mx-auto">{subtitle}</motion.p>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button onClick={onButtonClick} className="btn-primary">
                {buttonText}
                </button>
            </motion.div>
            </div>
        </div>
    </AnimatedSection>
  );
};

export default CtaBanner;
