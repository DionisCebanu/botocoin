import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SectionWrapper = ({ children, id, className }) => {
  return (
    <motion.section
      id={id}
      className={cn('section-wrapper', className)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="section-container">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;