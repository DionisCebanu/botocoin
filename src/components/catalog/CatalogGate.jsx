import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Coffee, Cookie, LayoutGrid, ArrowLeft } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

// Map category slug -> icon
const iconBySlug = {
  donuts: Cookie,
  drinks: Coffee,
};
const defaultIcon = LayoutGrid;

const API_BASE = import.meta.env.VITE_API_BASE || "https://event-api.dioniscode.com/public/api"; 
/* const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api"; */


const CatalogGate = ({ onSelectCategory }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // step state
  const [mode, setMode] = useState('categories'); // 'categories' | 'subcategories'
  const [activeCat, setActiveCat] = useState(null); // { slug, title, desc }
  const [subcats, setSubcats] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState('');

  // Icons for subcategory
  const SubIcon = React.useMemo(
    () => (activeCat ? (iconBySlug[activeCat.slug] || Cookie) : defaultIcon),
    [activeCat]
  );

  // Load categories
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

    const apiTiles = cats.map((c) => {
      const Icon = iconBySlug[c.slug] || defaultIcon;
      const translated = c.translated || {};
      const title = translated.name || c.name || c.slug;
      const desc  = translated.description || c.description || '';
      return { id: c.slug, icon: Icon, title, desc };
    });

    return [allTile, ...apiTiles];
  }, [cats, t]);

  // Fetch subcategories for a category slug
  const loadSubcategories = useCallback(async (cat) => {
    setSubLoading(true);
    setSubError('');
    setSubcats([]);

    try {
      const url = new URL(`${API_BASE}/categories/${encodeURIComponent(cat.slug)}/subcategories`);
      // If your endpoint later supports lang, you can pass it here:
      // url.searchParams.set('lang', i18n.language || 'en');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to load subcategories');
      const json = await res.json();
      const arr = Array.isArray(json?.data) ? json.data : [];

      if (arr.length > 0) {
        setActiveCat(cat);
        setSubcats(arr);
        setMode('subcategories');
      } else {
        // No subcategories: go straight to catalog
        console.log('[CatalogGate] Navigating (no subcategories):', `/catalog?cat=${cat.slug}`);
        navigate(`/catalog?cat=${encodeURIComponent(cat.slug)}`);
        if (typeof onSelectCategory === 'function') onSelectCategory(cat.slug);
      }
    } catch (e) {
      setSubError(e?.message || 'Failed to load subcategories');
      console.error('[CatalogGate] Subcategory load error:', e);
    } finally {
      setSubLoading(false);
    }
  }, [navigate, onSelectCategory /*, i18n.language*/]);

  // Click handlers
  const handleSelectCategory = (id) => {
    console.log('[CatalogGate] Category tile clicked:', { id });
    localStorage.setItem('lastCatalogCategory', id);

    if (id === 'all') {
      console.log('[CatalogGate] Navigating to ALL products');
      navigate('/catalog?cat=all');
      if (typeof onSelectCategory === 'function') onSelectCategory('all');
      return;
    }

    const cat = displayCats.find((c) => c.id === id);
    if (!cat) return;

    // Try to load subcategories; if none, it will navigate directly
    loadSubcategories({ slug: id, title: cat.title, desc: cat.desc });
  };

  const handleBack = () => {
    setMode('categories');
    setActiveCat(null);
    setSubcats([]);
    setSubLoading(false);
    setSubError('');
  };

  const handleChooseAllInCategory = () => {
    if (!activeCat) return;
    console.log('[CatalogGate] All-in-category tile clicked:', { category: activeCat.slug });
    navigate(`/catalog?cat=${encodeURIComponent(activeCat.slug)}`);
    if (typeof onSelectCategory === 'function') onSelectCategory(activeCat.slug);
  };

  const handleChooseSubcategory = (sub) => {
    if (!activeCat) return;
    console.log('[CatalogGate] Subcategory tile clicked:', {
        category: activeCat.slug,
        subcategory: sub.slug,
        subId: sub.id,
      });
    // route carries both cat and sub; your Catalog page can use `sub` if present
    navigate(
      `/catalog?cat=${encodeURIComponent(activeCat.slug)}&subcat=${encodeURIComponent(sub.slug)}`
    );
  };

  // ---------- RENDER ----------
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative text-center mx-auto mb-10 mt-10 px-6 py-10 rounded-3xl bg-white/10 dark:bg-dark-bg/40 backdrop-blur-lg border-2 border-amber-orange/30 dark:border-amber-orange/40 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] max-w-3xl"
        >
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-amber-orange via-chocolate-brown to-amber-orange dark:from-amber-orange dark:via-soft-cream dark:to-amber-orange drop-shadow-lg mb-4 transition-colors duration-300"
          >
            {mode === 'categories'
              ? t('catalog_gate_title')
              : (activeCat?.title || t('catalog_gate_title'))}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-lg md:text-xl text-chocolate-brown dark:text-soft-cream/80 max-w-2xl mx-auto font-medium tracking-wide transition-colors duration-300"
          >
            {mode === 'categories'
              ? t('catalog_gate_subtitle')
              : t('catalog_gate_subtitle')}
          </motion.p>
        </motion.div>

        {/* Loading / Error (Categories) */}
        {mode === 'categories' && (
          loading ? (
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
                    onClick={() => handleSelectCategory(cat.id)}
                    className={cn(
                      'p-8 rounded-3xl border-4 transition-all duration-300 text-left flex flex-col items-center justify-center text-center group overflow-hidden',
                      'border-soft-cream/40 dark:border-dark-subtle bg-white dark:bg-dark-surface shadow-xl',
                      'hover:bg-gradient-to-br hover:from-soft-cream/80 hover:to-amber-orange/20 dark:hover:bg-gradient-to-br dark:hover:from-dark-surface dark:hover:to-dark-subtle',
                      'hover:shadow-2xl hover:-translate-y-2 hover:scale-105',
                      'focus-visible:ring-4 focus-visible:ring-amber-orange/40'
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
          )
        )}

        {/* Subcategories Step */}
        {mode === 'subcategories' && (
          <>
            <motion.button
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              onClick={handleBack}
              className="btn-secondary mt-6 inline-flex items-center gap-2 text-warm-gray hover:text-chocolate-brown dark:hover:text-soft-cream transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('catalog_back') || 'Back'}
            </motion.button>

            {subLoading ? (
              <div className="mt-12 text-warm-gray">{t('loading') || 'Loading…'}</div>
            ) : subError ? (
              <div className="mt-12 text-red-600">{subError}</div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
              >
                {/* All {Category} tile */}
                <motion.button
                  variants={itemVariants}
                  onClick={handleChooseAllInCategory}
                  className={cn(
                    'p-8 rounded-2xl border-4 transition-all duration-300 text-left flex flex-col items-center justify-center text-center',
                    'border-transparent bg-white dark:bg-dark-surface hover:bg-soft-cream/50 dark:hover:bg-dark-surface/50 shadow-soft hover:shadow-lg hover:scale-[1.02]'
                  )}
                >
                  <LayoutGrid className="w-16 h-16 mb-4 text-amber-orange" />
                  <h3 className="text-2xl font-bold font-display text-chocolate-brown dark:text-soft-cream">
                    {`${t('catalog_gate_all')} ${activeCat?.title ?? ''}`}
                  </h3>
                </motion.button>

                {/* Subcategory tiles */}
                {subcats.map((s) => (
                  <motion.button
                    key={s.id}
                    variants={itemVariants}
                    onClick={() => handleChooseSubcategory(s)}
                    className={cn(
                      'p-8 rounded-3xl border-4 transition-all duration-300 text-left flex flex-col items-center justify-center text-center group overflow-hidden',
                      'border-soft-cream/40 dark:border-dark-subtle bg-white dark:bg-dark-surface shadow-xl',
                      'hover:bg-gradient-to-br hover:from-soft-cream/80 hover:to-amber-orange/20 dark:hover:bg-gradient-to-br dark:hover:from-dark-surface dark:hover:to-dark-subtle',
                      'hover:shadow-2xl hover:-translate-y-2 hover:scale-105',
                      'focus-visible:ring-4 focus-visible:ring-amber-orange/40'
                    )}
                  >
                    <SubIcon className="w-16 h-16 mb-4 text-amber-orange" />
                    <h3 className="text-2xl font-bold font-display text-chocolate-brown dark:text-soft-cream">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="mt-2 text-warm-gray dark:text-dark-subtle">{s.description}</p>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CatalogGate;
