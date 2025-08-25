import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { itemVariants } from '@/lib/animations';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ProductCard = ({ product }) => {
    const { t } = useTranslation();

    const handleNotImplemented = (feature) => {
        toast({
            title: `🚧 ${feature} is not implemented yet`,
            description: "But don't worry! You can request it in your next prompt! 🚀"
        });
    };
    
    return (
        <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl shadow-soft overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
            <div className="aspect-[4/3] overflow-hidden relative">
                <img alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400" src={product.img} loading="lazy" />
            </div>
            <div className="p-5 text-left flex flex-col flex-grow">
                <p className="text-xs text-warm-gray uppercase tracking-wider">{product.cat}</p>
                <h3 className="text-xl font-bold font-display text-chocolate-brown dark:text-soft-cream my-2">{product.title}</h3>
                <div className="flex items-center gap-2 my-2">
                    <div className="flex">
                        {[...Array(Math.floor(product.rating))].map((_, i) => <Star key={i} size={16} className="text-amber-orange fill-current" />)}
                        {[...Array(5 - Math.floor(product.rating))].map((_, i) => <Star key={i} size={16} className="text-amber-orange/30" />)}
                    </div>
                    <span className="text-sm text-warm-gray">({product.rating.toFixed(1)})</span>
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-chocolate-brown dark:text-soft-cream">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                         <Button onClick={() => handleNotImplemented(t('catalog_details'))} variant="outline" size="sm">{t('catalog_details')}</Button>
                         <Button onClick={() => handleNotImplemented(t('catalog_add_to_cart'))} size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2"/> {t('catalog_add_to_cart')}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;