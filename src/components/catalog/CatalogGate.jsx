import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Coffee, Cookie, ChevronsRight, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const categories = [
  { id: 'all', icon: LayoutGrid, titleKey: 'catalog_gate_all', descKey: 'catalog_gate_all_desc' },
  { id: 'donuts', icon: Cookie, titleKey: 'catalog_gate_donuts', descKey: 'catalog_gate_donuts_desc' },
  { id: 'drinks', icon: Coffee, titleKey: 'catalog_gate_drinks', descKey: 'catalog_gate_drinks_desc' },
];

const CatalogGate = ({ onSelectCategory }) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const lastCategory = localStorage.getItem('lastCatalogCategory');
        if (lastCategory && categories.some(c => c.id === lastCategory)) {
            setSelected(lastCategory);
        } else {
            setSelected('all');
        }
    }, []);

    const handleSelect = (id) => setSelected(id);
    const handleContinue = () => onSelectCategory(selected);
    
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4"
            >
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
                    <motion.h1 variants={itemVariants} className="font-display text-4xl md:text-6xl font-bold text-chocolate-brown dark:text-soft-cream">
                        {t('catalog_gate_title')}
                    </motion.h1>
                    <motion.p variants={itemVariants} className="mt-4 text-lg text-warm-gray dark:text-dark-subtle max-w-2xl mx-auto">
                        {t('catalog_gate_subtitle')}
                    </motion.p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
                >
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = selected === cat.id;
                        return (
                            <motion.button
                                key={cat.id}
                                variants={itemVariants}
                                onClick={() => handleSelect(cat.id)}
                                onDoubleClick={handleContinue}
                                className={cn(
                                    'p-8 rounded-2xl border-4 transition-all duration-300 text-left flex flex-col items-center justify-center text-center',
                                    isSelected 
                                    ? 'border-amber-orange bg-amber-orange/10 shadow-lg scale-105' 
                                    : 'border-transparent bg-white dark:bg-dark-surface hover:bg-soft-cream/50 dark:hover:bg-dark-surface/50 shadow-soft'
                                )}
                                aria-pressed={isSelected}
                            >
                                <Icon className="w-16 h-16 mb-4 text-amber-orange"/>
                                <h3 className="text-2xl font-bold font-display text-chocolate-brown dark:text-soft-cream">{t(cat.titleKey)}</h3>
                                <p className="mt-2 text-warm-gray dark:text-dark-subtle">{t(cat.descKey)}</p>
                            </motion.button>
                        )
                    })}
                </motion.div>
                
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-12">
                     <button
                        onClick={handleContinue}
                        className="btn-primary !px-12 !py-4 text-lg"
                        disabled={!selected}
                     >
                        {t('catalog_gate_continue')}
                        <ChevronsRight className="ml-2 w-5 h-5"/>
                     </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CatalogGate;