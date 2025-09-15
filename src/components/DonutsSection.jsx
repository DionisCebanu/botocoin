import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/AnimatedSection';
import { containerCardsVariants, itemCardsVariants, itemVariants } from '@/lib/animations';
import DonutCard from '@/cards/DonutCard';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

const DonutsSection = ({ onOrderClick }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Fetch donuts dynamically, with translations for the current locale
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const url = new URL(`${API_BASE}/categories/donuts/products`);
    if (i18n.language) url.searchParams.set('lang', i18n.language);
    url.searchParams.set('per_page', '4');
    url.searchParams.set('page', '1')

    fetch(url.toString())
      .then(res => {
        if (!res.ok) throw new Error('Failed to load donuts');
        return res.json();
      })
      .then(json => {
        if (!alive) return;
        const arr = Array.isArray(json?.data) ? json.data : [];

        // Map API -> DonutCard props
        const mapped = arr.map((p, idx) => {
          const title = p?.translated?.title ?? p?.title ?? '';
          const description = p?.translated?.description ?? p?.description ?? '';
          const cover =
            p?.coverUrl ||
            p?.images?.[0]?.url ||
            `/img/donuts/hero-${(idx % 8) + 1}.png`; // mild fallback to your static set

          return {
            id: p.id,
            name: title,
            description,
            imageSrc: cover,
            raw: p,
          };
        });

        setItems(mapped);
      })
      .catch(err => {
        if (!alive) return;
        setError(err?.message || 'Failed to load donuts');
        setItems([]);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [i18n.language]);

  return (
    <AnimatedSection as="section" id="donuts" className="section-wrapper bg-white dark:bg-dark-surface">
      <div className="section-container text-center">
        <motion.h2 variants={itemVariants} className="section-title section-title-underline">
          {t('donuts_title')}
        </motion.h2>
        <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4 mb-12">
          {t('donuts_subtitle')}
        </motion.p>

        {/* Loading / error states */}
        {loading ? (
          <div className="py-8 text-warm-gray">{t('loading') || 'Loading…'}</div>
        ) : error ? (
          <div className="py-8 text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-warm-gray">{t('no_products_found') || 'No donuts found.'}</div>
        ) : (
          <motion.ul
            key={`donuts-${i18n.language}`} // remount on locale change to replay animation
            variants={containerCardsVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          >
            {items.map((donut, index) => (
              <DonutCard
                key={donut.id ?? `${donut.name}-${index}`}
                variants={itemCardsVariants}
                name={donut.name}
                description={donut.description}
                imageSrc={donut.imageSrc}
                ctaLabel={t('order_button')}
                onOrder={() =>
                      window.location.href = `/details/${donut.raw?.id ?? ''}`
                }
              />
            ))}
          </motion.ul>
        )}

        {/* View all (catalog filtered to donuts) */}
        <motion.div variants={itemVariants} className="mt-12">
          <button 
            onClick={() => navigate('/catalog?cat=donuts')}
            className="btn-secondary btn-accent"
          >
            {t('view_full_catalog_button')}
          </button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default DonutsSection;
