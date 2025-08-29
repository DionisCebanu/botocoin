import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Coffee, Cookie, ChevronsRight, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

// Map category slug -> icon
const iconBySlug = {
  donuts: Cookie,
  drinks: Coffee,
};
const defaultIcon = LayoutGrid;

const API_BASE = import.meta.env.VITE_API_BASE || "https://event-api.dioniscode.com/public/api"; 

const CatalogGate = ({ onSelectCategory }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [cats, setCats] = useState([]);       // backend categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load categories from backend
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const url = new URL(`${API_BASE}/categories`);
    url.searchParams.set('lang', i18n.language || 'en');

    fetch(url.toString())
      .then(res => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      })
      .then(json => {
        if (!alive) return;
        const arr = Array.isArray(json?.data) ? json.data : [];
        setCats(arr);
      })
      .catch(err => {
        if (!alive) return;
        setError(err.message || 'Failed to load categories');
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [i18n.language]);

  // Build display list: "All" + API categories
  const displayCats = useMemo(() => {
    const allTile = {
      id: 'all',
      icon: LayoutGrid,
      title: t('catalog_gate_all'),
      desc: t('catalog_gate_all_desc'),
    };

    const apiTiles = cats.map(c => {
      const Icon = iconBySlug[c.slug] || defaultIcon;
      // Prefer translated fields if present, else fall back to DB values
      const translated = c.translated || {};
      const title = translated.name || c.name || c.slug;
      const desc  = translated.description || c.description || '';
      return { id: c.slug, icon: Icon, title, desc };
    });

    return [allTile, ...apiTiles];
  }, [cats, t]);

  // Initialize selection (restore last saved if it exists in current list)
  useEffect(() => {
    const last = localStorage.getItem('lastCatalogCategory');
    const validIds = new Set(displayCats.map(c => c.id));
    if (last && validIds.has(last)) {
      setSelected(last);
    } else {
      setSelected('all');
    }
  }, [displayCats.length]); // re-run when categories load

  const handleSelect = (id) => setSelected(id);
  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem('lastCatalogCategory', selected);
    onSelectCategory(selected);
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
          <motion.h1 variants={itemVariants} className="font-display text-4xl md:text-6xl font-bold text-chocolate-brown dark:text-soft-cream">
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
            {displayCats.map(cat => {
              const Icon = cat.icon;
              const isSelected = selected === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  variants={itemVariants}
                  onClick={() => handleSelect(cat.id)}
                  onDoubleClick={handleContinue}
                  className={cn(
                    'p-8 rounded-2xl border-4 transition-all duration-300 text-left flex flex-col items-center justify-center text-center',
                    isSelected
                      ? 'border-amber-orange bg-amber-orange/10 shadow-lg scale-105'
                      : 'border-transparent bg-white dark:bg-dark-surface hover:bg-soft-cream/50 dark:hover:bg-dark-surface/50 shadow-soft'
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon className="w-16 h-16 mb-4 text-amber-orange" />
                  <h3 className="text-2xl font-bold font-display text-chocolate-brown dark:text-soft-cream">
                    {cat.title}
                  </h3>
                  {cat.desc && (
                    <p className="mt-2 text-warm-gray dark:text-dark-subtle">{cat.desc}</p>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-12">
          <button
            onClick={handleContinue}
            className="btn-primary !px-12 !py-4 text-lg"
            disabled={!selected}
          >
            {t('catalog_gate_continue')}
            <ChevronsRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CatalogGate;
