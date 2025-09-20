import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { itemVariants } from '@/lib/animations';
import { LayoutGrid, ChevronRight } from "lucide-react";
import CategoryTabs from './CategoryTabs';
import FiltersBar from './FiltersBar';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import { Frown } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://event-api.dioniscode.com/public/api';
/* const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'; */
const ITEMS_PER_PAGE = 6;

const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category:   searchParams.get('cat') || 'all',
    subcategory: searchParams.get('subcat') || '',           // <-- NEW
    searchTerm: searchParams.get('q') || '',
    priceRange: searchParams.get('price')?.split(',').map(Number) || [0, 20],
    sortBy:     searchParams.get('sort') || 'popular',
    page:       Number(searchParams.get('page')) || 1,
  };

  const setFilters = useCallback((newFilters) => {
    const currentParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value === '')
      ) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });

    // If anything except page changed, reset page to 1
    if (newFilters.page === undefined) currentParams.set('page', '1');
    setSearchParams(currentParams);
  }, [searchParams, setSearchParams]);

  return [filters, setFilters];
};

// normalize 'en-US' -> 'en', 'fr-CA' -> 'fr'
const normalizeLang = (l) => {
  if (!l) return null;
  const lc = String(l).toLowerCase();
  if (lc.startsWith('fr')) return 'fr';
  if (lc.startsWith('en')) return 'en';
  return null;
};

export default function CatalogShell() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useProductFilters();

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [apiItems, setApiItems] = useState([]);
  const [serverPages, setServerPages] = useState(1);

  // Fetch products whenever category/subcategory/page/searchTerm/lang changes
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const lang = normalizeLang(i18n.language) || 'en';

    const fetchProducts = async () => {
      try {
        let url;

        if (filters.category === 'all') {
          // /api/products
          url = new URL(`${API_BASE}/products`);
          url.searchParams.set('per_page', String(ITEMS_PER_PAGE));
          url.searchParams.set('page', String(filters.page));
          url.searchParams.set('lang', lang);
          if (filters.searchTerm) url.searchParams.set('q', filters.searchTerm);
          // url.searchParams.set('active', '1'); // optional
        } else if (filters.subcategory) {
          // /api/categories/{category}/subcategories/{subcategory}/products
          url = new URL(`${API_BASE}/categories/${encodeURIComponent(filters.category)}/subcategories/${encodeURIComponent(filters.subcategory)}/products`);
          url.searchParams.set('per_page', String(ITEMS_PER_PAGE));
          url.searchParams.set('page', String(filters.page));
          url.searchParams.set('lang', lang);
        } else {
          // /api/categories/{category}/products
          url = new URL(`${API_BASE}/categories/${encodeURIComponent(filters.category)}/products`);
          url.searchParams.set('per_page', String(ITEMS_PER_PAGE));
          url.searchParams.set('page', String(filters.page));
          url.searchParams.set('lang', lang);
        }

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to load products');
        const json = await res.json();

        const items = Array.isArray(json?.data) ? json.data : [];

        const mapped = items.map((p) => ({
          id: p.id,
          title: p?.translated?.title ?? p.title ?? '',
          cat: p.category?.slug || 'uncategorized',
          price: Number(p.price ?? 0),
          rating: p.rating == null ? 0 : Number(p.rating),
          img: p.coverUrl || p.images?.[0]?.url || '',

          coverUrl: p.coverUrl,
          images: p.images,
          category: p.category,
          translated: p.translated,
          slug: p.slug,
          description: p?.translated?.description ?? p.description ?? '',

          popular: false,
          newest: false,

          _raw: p,
        }));

        if (!alive) return;
        setApiItems(mapped);
        setServerPages(Number(json?.meta?.last_page ?? 1));
      } catch (err) {
        if (!alive) return;
        setError(err.message || 'Failed to load products');
        setApiItems([]);
        setServerPages(1);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProducts();
    return () => { alive = false; };
  }, [filters.category, filters.subcategory, filters.page, filters.searchTerm, i18n.language]);

  const handleFilterChange = (newFilter) => setFilters(newFilter);

  // When switching category via tabs, clear any subcategory in URL
  const handleCategoryChange = (newCategory) => setFilters({ cat: newCategory, subcat: '' });

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side filter/sort over the current page results
  const filteredAndSortedProducts = useMemo(() => {
    let products = apiItems.slice();

    // If using category/subcategory endpoints, 'q' isn't server-filtered → filter here
    if (filters.category !== 'all' && filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      products = products.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Price filter
    products = products.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => (b.newest ? 1 : 0) - (a.newest ? 1 : 0));
        break;
      case 'popular':
      default:
        products.sort(
          (a, b) =>
            (b.popular ? 1 : 0) - (a.popular ? 1 : 0) ||
            b.rating - a.rating
        );
        break;
    }

    return products;
  }, [apiItems, filters.category, filters.searchTerm, filters.priceRange, filters.sortBy]);

  const paginatedProducts = filteredAndSortedProducts;
  const totalPages = serverPages;

  const maxPrice = useMemo(() => {
    const max = Math.max(0, ...apiItems.map((p) => p.price));
    return Math.max(20, Math.ceil(max));
  }, [apiItems]);

  return (
    <div className="section-container pb-24">
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <div className="relative text-center mb-12 mt-12 px-4 py-10 rounded-3xl bg-white/10 dark:bg-dark-bg/30 backdrop-blur-md border border-soft-cream/30 dark:border-dark-subtle/40 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
  <h1 className="section-title drop-shadow-lg text-chocolate-brown dark:text-soft-cream transition-colors duration-300">{t('catalog_shell_title')}</h1>
  <p className="section-subtitle mx-auto mt-4 mb-4 text-warm-gray dark:text-dark-subtle text-lg transition-colors duration-300">{t('catalog_shell_subtitle')}</p>
  <Link
      to="/catalog"
      className="
        group inline-flex items-center gap-2
        px-6 py-3 rounded-full font-bold
        text-white hover:text-white
        bg-amber-orange/80 hover:bg-amber-orange
        shadow-md hover:shadow-xl
        ring-2 ring-amber-orange/30 hover:ring-amber-orange/60
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-orange/70
        active:scale-95
      "
    >
      <LayoutGrid className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
      <span>{t('catalog_change_category')}</span>
      <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  </div>

        <CategoryTabs
          activeCategory={filters.category}
          onCategoryChange={handleCategoryChange}
        />
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          maxPrice={maxPrice}
        />
      </motion.div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading…</p>
      ) : error ? (
        <div className="text-center py-20">
          <Frown className="mx-auto h-16 w-16 text-warm-gray" />
          <h3 className="mt-4 text-2xl font-semibold" style={{ color: 'red' }}>
            {error}
          </h3>
        </div>
      ) : paginatedProducts.length > 0 ? (
        <ProductsGrid products={paginatedProducts} />
      ) : (
        <div className="text-center py-20">
          <Frown className="mx-auto h-16 w-16 text-warm-gray" />
          <h3 className="mt-4 text-2xl font-semibold">{t('no_products_found')}</h3>
          <p className="mt-2 text-warm-gray">{t('no_products_found_desc')}</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
