import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Coffee, Cookie, LayoutGrid } from 'lucide-react';

const categories = [
  { id: 'all', icon: LayoutGrid, titleKey: 'catalog_gate_all' },
  { id: 'donuts', icon: Cookie, titleKey: 'catalog_gate_donuts' },
  { id: 'drinks', icon: Coffee, titleKey: 'catalog_gate_drinks' },
];

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-dark-surface p-2 rounded-full shadow-soft flex items-center space-x-2">
                {categories.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={cn(
                                'relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-colors flex items-center gap-2',
                                isActive 
                                ? 'text-white'
                                : 'text-chocolate-brown dark:text-soft-cream/80 hover:bg-soft-cream dark:hover:bg-dark-bg'
                            )}
                            aria-pressed={isActive}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategoryTab"
                                    className="absolute inset-0 bg-amber-orange rounded-full"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10"><Icon className="w-5 h-5" /></span>
                            <span className="relative z-10">{t(cat.titleKey)}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default CategoryTabs;