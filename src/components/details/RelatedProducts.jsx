import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
/* import allProducts from '@/data/allProducts.json'; */
import ProductCard from '@/components/catalog/ProductCard';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

const RelatedProducts = ({ currentItemId, category }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for the same category
  useEffect(() => {
    let alive = true;
    if (!category) { setItems([]); setLoading(false); return; }

    setLoading(true);
    fetch(`${API_BASE}/categories/${category}/products`)
      .then(res => { if (!res.ok) throw new Error('Failed to load'); return res.json(); })
      .then(json => {
        if (!alive) return;
        const arr = Array.isArray(json?.data) ? json.data : [];

        // Map API -> UI shape ProductCard expects
        const mapped = arr
          .filter(p => p.id !== currentItemId)
          .map(p => ({
            id: p.id,
            title: p.title,
            cat: p.category?.slug || category,
            price: Number(p.price ?? 0),
            rating: 0,                 // API has no rating
            img: p.coverUrl || '',     // ProductCard usually uses product.img
            _raw: p,
          }));

        setItems(mapped);
      })
      .catch(() => alive && setItems([]))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [category, currentItemId]);

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