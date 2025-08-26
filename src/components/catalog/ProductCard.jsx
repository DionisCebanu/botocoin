import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { itemVariants } from '@/lib/animations';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const CART_KEY = 'botocoin_cart_ids';
const pushId = (id) => {
  try {
    const ids = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    ids.push(String(id));
    localStorage.setItem(CART_KEY, JSON.stringify(ids));
    // notify /cart to refresh
    window.dispatchEvent(new Event('cart-updated'));
  } catch {}
};

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { add } = useCart(); // keep your context in sync if you use it elsewhere

  const handleAddToCart = () => {
    // 1) localStorage (source of truth for /cart)
    pushId(product.id);
    // 2) optional: your existing context
    try { add(product, 1); } catch {}

    toast({
      title: `✅ ${t('toast_added_to_cart_title')}`,
      description: `${product.title} ${t('toast_added_to_cart_desc')}`,
    });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-dark-surface rounded-2xl shadow-soft overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <Link to={`/details/${product.id}`} state={{ from: location.search }}>
          <img
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
            src={product.img}
            loading="lazy"
          />
        </Link>
        <Button onClick={handleAddToCart} size="sm" className="bg-amber-orange hover:bg-[rgb(204,135,19)] transition-all duration-500 text-white font-bold absolute top-1 right-3">
            <ShoppingCart className="h-4 w-4 mr-2" /> {t('catalog_add_to_cart')}
        </Button>
      </div>

      <div className="p-5 text-left flex flex-col flex-grow">
        <p className="text-xs text-warm-gray uppercase tracking-wider">{product.cat}</p>
        <Link to={`/details/${product.id}`} state={{ from: location.search }}>
          <h3 className="text-xl font-bold font-display text-chocolate-brown dark:text-soft-cream my-2 hover:text-amber-orange transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 my-2">
          <div className="flex">
            {[...Array(Math.floor(product.rating))].map((_, i) => (
              <Star key={i} size={16} className="text-amber-orange fill-current" />
            ))}
            {[...Array(5 - Math.floor(product.rating))].map((_, i) => (
              <Star key={i} size={16} className="text-amber-orange/30" />
            ))}
          </div>
          <span className="text-sm text-warm-gray">({product.rating.toFixed(1)})</span>
        </div>

        <div className="mt-auto pt-4 flex-col justify-between items-center">
          <p className="text-xl font-bold text-chocolate-brown dark:text-soft-cream mb-5">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm" className="w-full bg-amber-orange hover:bg-[rgb(204,135,19)] transition-all duration-500 text-white font-bold">
              <Link to={`/details/${product.id}`} state={{ from: location.search }}>
                {t('catalog_details')}
              </Link>
            </Button>
           
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
