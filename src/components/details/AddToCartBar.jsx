import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, Zap } from 'lucide-react';
import QuantityStepper from './QuantityStepper';
import { useCart } from '@/context/CartContext';

const AddToCartBar = ({ item }) => {
    const [quantity, setQuantity] = useState(1);
    const { t } = useTranslation();
    const { add } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        add(item, quantity);
        toast({
            title: `✅ ${t('toast_added_to_cart_title')}`,
            description: `${quantity} x ${item.title} ${t('toast_added_to_cart_desc')}`,
        });
    };

    const handleOrderNow = () => {
        add(item, quantity);
        navigate('/cart');
    };
    
 return (
    <div className="mt-8">
      <div
        className="
          rounded-2xl border border-neutral-200/70 dark:border-white/10
          bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md
          shadow-sm
          px-4 py-3 md:px-5 md:py-4
        "
      >
        {/* tout en ligne, avec wrap en cas d'écran très étroit */}
        <div
          className="
            flex flex-col gap-3 md:gap-4
            flex-wrap md:flex-nowrap
            overflow-x-auto md:overflow-visible
          "
        >
          {/* Stepper compact, non réductible */}
          <div className="shrink-0">
            <QuantityStepper quantity={quantity} setQuantity={setQuantity} />
          </div>

          {/* Boutons alignés sur la même ligne */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-[260px]">
            {/* Add to cart — gradient button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="
                w-full md:flex-1
                rounded-xl
                text-white
                bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600
                hover:opacity-95
                border-0
                shadow-lg hover:shadow-xl
                transition-all active:scale-[.99]
                focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-0
              "
              aria-label={t("catalog_add_to_cart")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t("catalog_add_to_cart")}
            </Button>

            {/* Order now — soft outline / glassy */}
            <Button
              onClick={handleOrderNow}
              size="lg"
              variant="secondary"
              className="
                w-full md:w-auto
                rounded-xl
                border border-rose-200/70 dark:border-rose-400/30
                bg-rose-50/70 dark:bg-rose-500/10
                text-rose-700 dark:text-rose-100
                hover:bg-rose-100/80 dark:hover:bg-rose-500/20
                shadow-sm hover:shadow
                transition-all active:scale-[.99]
                focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-0
              "
              aria-label={t("product_details_order_now")}
            >
              <Zap className="mr-2 h-5 w-5" />
              {t("product_details_order_now")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartBar;