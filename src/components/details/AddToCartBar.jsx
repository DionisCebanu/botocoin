import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart } from 'lucide-react';
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
        <div className="mt-8 pt-8 border-t border-chocolate-brown/10 dark:border-warm-gray/20">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <QuantityStepper quantity={quantity} setQuantity={setQuantity} />
                <div className="flex-grow w-full flex gap-4">
                    <Button onClick={handleAddToCart} size="lg" className="w-full">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t('catalog_add_to_cart')}
                    </Button>
                    <Button onClick={handleOrderNow} size="lg" variant="secondary" className="w-full hidden sm:inline-flex">
                        {t('product_details_order_now')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddToCartBar;