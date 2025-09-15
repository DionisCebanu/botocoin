import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Coffee, Cookie, LayoutGrid } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

// Map slug -> icon
const iconBySlug = {
  donuts: Cookie,
  drinks: Coffee,
};
const defaultIcon = LayoutGrid;

/* const API_BASE = import.meta.env.VITE_API_BASE || "https://event-api.dioniscode.com/public/api";  */
const API_BASE = import.meta.env.VITE_API_BASE || "https://event-api.dioniscode.com/public/api";

const CatalogGate = ({ onSelectCategory }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les catégories
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const url = new URL(`${API_BASE}/categories`);
    url.searchParams.set('lang', i18n.language || 'en');

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      })
      .then((json) => {
        if (!alive) return;
        const arr = Array.isArray(json?.data) ? json.data : [];
        setCats(arr);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || 'Failed to load categories');
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [i18n.language]);

  // Construire la liste d’affichage : "Tous" + catégories API
  const displayCats = useMemo(() => {
    const allTile = {
      id: 'all',
      icon: LayoutGrid,
      title: t('catalog_gate_all'),
      desc: t('catalog_gate_all_desc'),
    };

    const apiTiles = cats.map((c) => {
      const Icon = iconBySlug[c.slug] || defaultIcon;
      const translated = c.translated || {};
      const title = translated.name || c.name || c.slug;
      const desc = translated.description || c.description || '';
      return { id: c.slug, icon: Icon, title, desc };
    });

    return [allTile, ...apiTiles];
  }, [cats, t]);

  // Click = mémoriser + redirection immédiate
  const handleSelect = (id) => {
    localStorage.setItem('lastCatalogCategory', id);
    if (typeof onSelectCategory === 'function') {
      onSelectCategory(id);
    }
    if (id === 'all') {
      navigate('/catalog?cat=all');
    } else {
      navigate(`/catalog?cat=${encodeURIComponent(id)}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl md:text-6xl font-bold text-chocolate-brown dark:text-soft-cream"
          >
            {t('catalog_gate_title')}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-lg text-warm-gray dark:text-dark-subtle max-w-2xl mx-auto">
            {t('catalog_gate_subtitle')}
          </motion.p>
        </motion.div>

        {/* Loading / Error */}
        {loading ? (
          <div className="mt-12 text-warm-gray">{t('loading') || 'Loading…'}</div>
        ) : error ? (
          <div className="mt-12 text-red-600">{error}</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
          >
            {displayCats.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  variants={itemVariants}
                  onClick={() => handleSelect(cat.id)}
                  className={cn(
                    'p-8 rounded-2xl border-4 transition-all duration-300 text-left flex flex-col items-center justify-center text-center',
                    'border-transparent bg-white dark:bg-dark-surface hover:bg-soft-cream/50 dark:hover:bg-dark-surface/50 shadow-soft hover:shadow-lg hover:scale-[1.02]'
                  )}
                >
                  <Icon className="w-16 h-16 mb-4 text-amber-orange" />
                  <h3 className="text-2xl font-bold font-display text-chocolate-brown dark:text-soft-cream">
                    {cat.title}
                  </h3>
                  {cat.desc && <p className="mt-2 text-warm-gray dark:text-dark-subtle">{cat.desc}</p>}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CatalogGate;
