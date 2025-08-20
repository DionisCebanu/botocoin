import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DonutSVG = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="15" fill="var(--bg-color, #FFF7E6)" />
    </svg>
);

const donuts = Array.from({ length: 7 }).map((_, i) => ({
  id: i,
  style: {
    top: `${Math.random() * 90 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    '--bg-color': 'var(--tw-bg-soft-cream)',
  },
  size: Math.random() * 30 + 25, // 25-55px
  duration: Math.random() * 6 + 12, // 12-18s
  delay: Math.random() * 8,
}));

const FloatingDonuts = () => {
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches);
        updateMotionPreference();
        mediaQuery.addEventListener('change', updateMotionPreference);
        return () => mediaQuery.removeEventListener('change', updateMotionPreference);
    }, []);

    if (isReducedMotion) {
        return null;
    }

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          {donuts.map(donut => (
            <motion.div
              key={donut.id}
              className="absolute text-amber-orange/30 dark:text-amber-orange/10"
              style={donut.style}
              initial={{
                  width: donut.size,
                  height: donut.size,
                  y: '50vh',
                  x: Math.random() > 0.5 ? '50vw' : '-50vw',
                  rotate: Math.random() * 360,
              }}
              animate={{
                y: ['0vh', '-100vh'],
                x: [Math.random() * 100 - 50 + 'vw', Math.random() * 100 - 50 + 'vw'],
                rotate: [0, Math.random() > 0.5 ? 720 : -720],
              }}
              transition={{
                duration: donut.duration,
                repeat: Infinity,
                ease: "linear",
                delay: donut.delay
              }}
            >
              <DonutSVG className="w-full h-full" />
            </motion.div>
          ))}
        </div>
    );
};

export default FloatingDonuts;