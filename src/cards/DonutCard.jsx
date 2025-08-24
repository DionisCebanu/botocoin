import React from 'react';
import { motion } from 'framer-motion';

const DonutCard = ({ name, description, imageSrc, ctaLabel, onOrder, variants }) => {
  return (
    <motion.li variants={variants} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-soft-cream/70 dark:bg-dark-bg ring-1 ring-brown/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image : ratio uniforme */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        {/* Contenu */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg md:text-xl font-semibold font-display text-chocolate-brown dark:text-soft-cream">
            {name}
          </h3>
          <p className="mt-2 text-sm text-warm-gray md:text-base line-clamp-2">
            {description}
          </p>

          <div className="mt-auto pt-5">
            <button
              onClick={onOrder}
              className="w-full btn-secondary py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </article>
    </motion.li>
  );
};

export default DonutCard;
