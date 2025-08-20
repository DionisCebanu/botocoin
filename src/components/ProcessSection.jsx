import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { motion } from 'framer-motion';
import { Leaf, Hand, Flame, Heart } from 'lucide-react';
import WaveDivider from './WaveDivider';

const steps = [
  { icon: Leaf, title: "Fresh Ingredients", description: "Local and natural products only." },
  { icon: Hand, title: "Handmade Batches", description: "Every donut is crafted by hand." },
  { icon: Flame, title: "Perfect Cooking", description: "Golden outside, fluffy inside." },
  { icon: Heart, title: "Love & Passion", description: "Each piece carries a story." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ProcessSection = () => {
  return (
    <SectionWrapper id="process" className="bg-creamy-beige dark:bg-dark-bg">
      <div className="text-center mb-12 md:mb-20">
        <h2 className="section-title">Notre Processus Artisanal</h2>
        <p className="section-subtitle">
          De la sélection des ingrédients au service, chaque étape est une promesse de qualité.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {steps.map((step) => (
          <motion.div
            key={step.title}
            variants={itemVariants}
            className="group"
          >
            <div className="bg-creamy-beige dark:bg-dark-surface p-6 rounded-2xl card-shadow flex items-center gap-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-golden-caramel/20 dark:bg-golden-caramel/10 text-golden-caramel rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-golden-caramel group-hover:text-white">
                <step.icon size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-cocoa-brown dark:text-creamy-beige mb-1">{step.title}</h3>
                <p className="text-sm text-warm-gray dark:text-dark-subtle">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <WaveDivider />
    </SectionWrapper>
  );
};

export default ProcessSection;