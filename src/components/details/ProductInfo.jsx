
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Leaf, AlertTriangle, Ruler } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const ProductInfo = ({ item }) => {
    const { t } = useTranslation();

    const renderBadge = (type, text) => {
        const baseClass = "text-xs font-bold px-2.5 py-1 rounded-full";
        let colorClass = "";
        switch (type) {
            case 'newest': colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"; break;
            case 'popular': colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"; break;
            case 'sale': colorClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"; break;
            default: colorClass = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"; break;
        }
        return <span className={`${baseClass} ${colorClass}`}>{text}</span>
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-orange">{item.cat}</span>
                <div className="flex gap-2">
                    {item.newest && renderBadge('newest', t('product_details_badge_new'))}
                    {item.popular && renderBadge('popular', t('product_details_badge_bestseller'))}
                </div>
            </div>
            
            <h1 className="section-title !text-4xl">{item.title}</h1>
            
            <div className="flex items-center gap-2 text-lg">
                <div className="flex text-amber-orange">
                    {[...Array(Math.floor(item.rating))].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                    {[...Array(5 - Math.floor(item.rating))].map((_, i) => <Star key={i} size={20} className="text-amber-orange/30" />)}
                </div>
                <span className="font-semibold text-chocolate-brown dark:text-soft-cream">{item.rating.toFixed(1)}</span>
                <span className="text-warm-gray">({item.reviewCount || 0} {t('product_details_reviews')})</span>
            </div>
            
            <p className="text-4xl font-bold font-display text-chocolate-brown dark:text-soft-cream">${item.price.toFixed(2)}</p>
            
            <p className="text-warm-gray leading-relaxed text-lg pt-4">{item.description}</p>
            
            <Accordion type="single" collapsible className="w-full pt-4">
              {item.ingredients && (
                <AccordionItem value="ingredients">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-green-leaf flex-shrink-0" />
                      <h4 className="font-bold">{t('product_details_ingredients')}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-warm-gray text-sm pl-8">{item.ingredients.join(', ')}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {item.allergens && item.allergens.length > 0 && (
                <AccordionItem value="allergens">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <h4 className="font-bold">{t('product_details_allergens')}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-warm-gray text-sm pl-8">{item.allergens.join(', ')}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {item.size && (
                <AccordionItem value="size">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Ruler className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <h4 className="font-bold">{t('product_details_size')}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-warm-gray text-sm pl-8">{item.size}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
        </div>
    );
};

export default ProductInfo;
