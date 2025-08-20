import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const EventFormSection = ({ onFormSubmit }) => {
  const formVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  };
  
  return (
    <motion.section 
      id="contact" 
      className="section-wrapper bg-soft-cream dark:bg-dark-bg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="section-container">
        <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y:20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Contactez-nous
            </motion.h2>
            <motion.p 
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y:20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Une question ou une demande de traiteur ? Nous sommes là pour vous.
            </motion.p>
        </div>

        <motion.form
            variants={formVariants}
            onSubmit={onFormSubmit}
            className="bg-white dark:bg-dark-surface p-8 md:p-10 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6"
        >
            <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Votre nom" required className="w-full p-4 rounded-md bg-soft-cream/50 dark:bg-dark-bg dark:text-white placeholder-warm-gray focus:ring-2 focus:ring-amber-orange outline-none"/>
                <input type="email" placeholder="Votre email" required className="w-full p-4 rounded-md bg-soft-cream/50 dark:bg-dark-bg dark:text-white placeholder-warm-gray focus:ring-2 focus:ring-amber-orange outline-none"/>
            </div>
            <div>
                <select required className="w-full p-4 rounded-md bg-soft-cream/50 dark:bg-dark-bg dark:text-white text-warm-gray focus:ring-2 focus:ring-amber-orange outline-none appearance-none">
                    <option value="">Type de demande</option>
                    <option value="catering">Traiteur</option>
                    <option value="custom">Commande personnalisée</option>
                    <option value="other">Autre</option>
                </select>
            </div>
            <textarea placeholder="Votre message..." rows={5} required className="w-full p-4 rounded-md bg-soft-cream/50 dark:bg-dark-bg dark:text-white placeholder-warm-gray focus:ring-2 focus:ring-amber-orange outline-none"></textarea>
            <div className="text-center">
            <button type="submit" className="btn-primary">
                <Send className="mr-2 h-5 w-5" />
                Envoyer le message
            </button>
            </div>
      </motion.form>
      </div>
    </motion.section>
  );
};

export default EventFormSection;