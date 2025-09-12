import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ProductCard from '@/components/catalog/ProductCard';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://event-api.dioniscode.com/public/api';

const RelatedProducts = ({ currentItemId, category }) => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for the same category, localized
  useEffect(() => {
    let alive = true;
    if (!category) { setItems([]); setLoading(false); return; }

    setLoading(true);
    const url = new URL(`${API_BASE}/categories/${category}/products`);
    url.searchParams.set('lang', i18n.language || 'en');

    fetch(url.toString())
      .then(res => { if (!res.ok) throw new Error('Failed to load'); return res.json(); })
      .then(json => {
        if (!alive) return;
        const arr = Array.isArray(json?.data) ? json.data : [];

        const mapped = arr
          .filter(p => p.id !== currentItemId)
          .map(p => {
            const tl = p.translated || {};
            return {
              id: p.id,
              title: tl.title || p.title,                      // <-- localized title
              cat: p.category?.slug || category,
              price: Number(p.price ?? 0),
              rating: p.rating === null || p.rating === undefined ? 4 : Number(p.rating),
              img: p.coverUrl || (p.images?.[0]?.url) || p.image_url || '',
              _raw: p,
            };
          });
          console.log('Related products:', mapped.map(p => p.img));

        setItems(mapped);
      })
      .catch(() => alive && setItems([]))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [category, currentItemId, i18n.language]);

  // Randomize and take up to 4 items
  const relatedItems = useMemo(() => {
    if (!items.length) return [];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [items]);

  if (loading || relatedItems.length === 0) return null;

  return (
    <AnimatedSection as="div" className="section-wrapper bg-white dark:bg-dark-surface">
      <div className="section-container">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold font-display text-center mb-12">
          {t('product_details_related_title')}
        </motion.h2>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {relatedItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default RelatedProducts;
