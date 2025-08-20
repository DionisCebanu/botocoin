import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';

const LocationSection = () => {
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

  return (
    <motion.section
        id="location-info"
        className="section-wrapper bg-white dark:bg-dark-surface"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
    >
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
                <h2 className="section-title mb-6">Venez nous rencontrer</h2>
                 <div className="space-y-6 text-lg">
                    <div className="flex items-start space-x-4">
                        <MapPin className="h-7 w-7 text-amber-orange mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-chocolate-brown dark:text-soft-cream">Adresse</h3>
                            <p className="text-warm-gray">3881 Rue Rachel E Local 5, Montréal, QC H1X 1Z2</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <Clock className="h-7 w-7 text-amber-orange mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-chocolate-brown dark:text-soft-cream">Heures d'ouverture</h3>
                            <p className="text-warm-gray">Lundi - Vendredi: 10h00 – 18h00</p>
                            <p className="text-warm-gray">Samedi: 10h00 – 16h00 | Dimanche: Fermé</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <Phone className="h-7 w-7 text-amber-orange mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-chocolate-brown dark:text-soft-cream">Téléphone</h3>
                            <p className="text-warm-gray">(514) 712-6497</p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
                 <div className="h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500 p-4">
                        <MapPin className="h-16 w-16 mx-auto mb-4 text-amber-orange" />
                        <p className="text-lg font-semibold">Emplacement de la carte OpenStreetMap</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default LocationSection;