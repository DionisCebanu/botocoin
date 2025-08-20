import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/SectionWrapper';
import { Donut } from 'lucide-react';
import WaveDivider from '@/components/WaveDivider';

const menuItems = [
  { name: "Beignets Classiques", description: "Le goût authentique et réconfortant.", image: "https://images.unsplash.com/photo-1625862249987-73a5a5f1597a?q=80&w=1964&auto=format&fit=crop" },
  { name: "Beignets Fourrés", description: "Une explosion de saveurs avec nos garnitures maison.", image: "https://images.unsplash.com/photo-1604329426219-918def252045?q=80&w=2070&auto=format&fit=crop" },
  { name: "Mini-Beignets", description: "Parfaits pour partager... ou pas !", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop" },
  { name: "Spéciaux de Saison", description: "Des créations uniques selon l'inspiration du moment.", image: "https://images.unsplash.com/photo-1509365223233-069a25838d2a?q=80&w=1974&auto=format&fit=crop" },
];

const MenuSection = ({ onOrderClick }) => {
  return (
    <SectionWrapper id="donuts" className="bg-turquoise/20">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="section-title">Nos Beignets</h2>
        <p className="section-subtitle">
          Chaque beignet est une invitation au voyage, préparé avec amour et tradition.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl card-shadow overflow-hidden flex flex-col group text-center"
          >
            <div className="h-56 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="font-display text-2xl font-semibold text-chocolate-brown">{item.name}</h3>
              <p className="text-warm-gray text-sm leading-relaxed my-3 flex-grow">{item.description}</p>
              <Button onClick={onOrderClick} className="btn-secondary w-full mt-5">
                 Commander
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <WaveDivider />
    </SectionWrapper>
  );
};

export default MenuSection;