import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { containerVariants } from '@/lib/animations';

const AnimatedSection = ({ children, className, as: Component = 'div', amount = 0.2, ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });

  return (
    <Component ref={ref} className={className} {...props}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    </Component>
  );
};

export default AnimatedSection;