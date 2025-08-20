import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { motion } from 'framer-motion';

const partners = [
  { name: "Marché Jean-Talon", image: "https://images.unsplash.com/photo-1583255113529-7204a7a48535?q=80&w=1974&auto=format&fit=crop" },
  { name: "Festival AfroMontréal", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop" },
  { name: "Pop-up Marché Créole", image: "https://images.unsplash.com/photo-1563203432-9337c3644860?q=80&w=1974&auto=format&fit=crop" },
];

const PartnersSection = () => {
  return (
    <SectionWrapper id="partners" className="bg-turquoise/20">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="section-title">Où vous nous avez vus</h2>
        <p className="section-subtitle">
          Nous aimons partager notre passion lors des meilleurs événements de Montréal.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {partners.map((partner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6">
              <img
                src={partner.image}
                alt={`Photo de l'événement ${partner.name}`}
                className="w-full h-full object-cover rounded-full shadow-xl border-4 border-white"
              />
            </div>
            <h3 className="text-2xl font-semibold text-chocolate-brown font-display">{partner.name}</h3>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default PartnersSection;