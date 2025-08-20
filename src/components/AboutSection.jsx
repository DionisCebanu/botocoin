import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const AboutSection = () => {
  return (
    <SectionWrapper id="histoire" className="bg-cream">
      <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden card-shadow">
            <img  alt="Fondatrice de Le Botocoin préparant des beignets avec un sourire chaleureux" className="w-full h-auto object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1703707893555-9d28743916ba" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <h2 className="section-title">
            Notre Histoire
          </h2>
          <p className="text-lg text-warm-gray leading-relaxed">
            Le Botocoin est né de la passion de partager les saveurs authentiques de l'Afrique de l'Ouest avec la communauté montréalaise. Nos beignets sont préparés selon des recettes traditionnelles transmises de génération en génération.
          </p>
          <p className="text-lg text-warm-gray leading-relaxed">
            Chaque beignet est façonné à la main avec amour, utilisant des ingrédients frais et de qualité. C'est plus qu'une pâtisserie, c'est un morceau de notre culture que nous partageons avec vous.
          </p>
          <div className="flex items-center space-x-4 pt-4">
            <Heart className="h-8 w-8 text-light-coral fill-current" />
            <span className="text-lg font-semibold text-chocolate-brown">
              Fait avec amour depuis 2020
            </span>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;