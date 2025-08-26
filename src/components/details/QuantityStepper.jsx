import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

const QuantityStepper = ({ quantity, setQuantity }) => {
    const { t } = useTranslation();

    const handleIncrement = () => setQuantity(q => Math.min(q + 1, 99));
    const handleDecrement = () => setQuantity(q => Math.max(q - 1, 1));

    return (
        <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-warm-gray mb-2">{t('product_details_quantity')}</label>
            <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={handleDecrement} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                </Button>
                <input 
                    id="quantity"
                    type="text" 
                    readOnly 
                    value={quantity}
                    className="w-16 h-10 text-center font-bold text-lg border-y border-gray-200 dark:border-gray-700 bg-transparent"
                    aria-live="polite"
                />
                <Button variant="outline" size="icon" onClick={handleIncrement} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default QuantityStepper;