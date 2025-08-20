import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Users } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import WaveDivider from '@/components/WaveDivider';

const values = [
  { icon: Leaf, title: "Ingrédients Frais & Naturels", description: "Nous sélectionnons les meilleurs produits locaux pour un goût authentique.", image: "https://images.unsplash.com/photo-1619149969418-8d9b6a37a2a7?q=80&w=1974&auto=format&fit=crop" },
  { icon: Award, title: "Savoir-faire Artisanal", description: "Des saveurs qui racontent une histoire, transmises avec amour et expertise.", image: "https://images.unsplash.com/photo-1556910110-a5a637e53c7a?q=80&w=2070&auto=format&fit=crop" },
  { icon: Users, title: "Accueil Chaleureux", description: "Plus qu'une boulangerie, un lieu de partage et de convivialité pour tous.", image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ValuesSection = () => {
  return (
    <SectionWrapper id="quality" className="bg-cream !pt-0">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="section-title">Notre Promesse Qualité</h2>
        <p className="section-subtitle">Notre passion pour l'excellence se retrouve dans chaque bouchée.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-3 gap-8 md:gap-12"
      >
        {values.map((value) => (
          <motion.div
            key={value.title}
            variants={itemVariants}
            className="bg-white rounded-3xl card-shadow overflow-hidden group"
          >
            <div className="h-56 overflow-hidden">
                <img src={value.image} alt={value.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8 text-center">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-turquoise rounded-full flex items-center justify-center text-white">
                  <value.icon size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-display text-chocolate-brown mb-3">{value.title}</h3>
              <p className="text-warm-gray">{value.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};

export default ValuesSection;