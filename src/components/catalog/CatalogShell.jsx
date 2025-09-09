import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { itemVariants } from '@/lib/animations';
import CategoryTabs from './CategoryTabs';
import FiltersBar from './FiltersBar';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import { Frown } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';
const ITEMS_PER_PAGE = 6;

const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category: searchParams.get('cat') || 'all',
    searchTerm: searchParams.get('q') || '',
    priceRange: searchParams.get('price')?.split(',').map(Number) || [0, 20],
    sortBy: searchParams.get('sort') || 'popular',
    page: Number(searchParams.get('page')) || 1,
  };

  const setFilters = useCallback(
    (newFilters) => {
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

      // reset page if we're changing anything except page itself
      if (newFilters.page === undefined) currentParams.set('page', '1');
      setSearchParams(currentParams);
    },
    [searchParams, setSearchParams]
  );

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
  const [error, setError] = useState('');
  const [apiItems, setApiItems] = useState([]); // mapped UI shape
  const [serverPages, setServerPages] = useState(1); // from API meta

  // Fetch products whenever category/page/searchTerm/lang changes
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const lang = normalizeLang(i18n.language) || 'en';

    const fetchProducts = async () => {
      try {
        let url;

        if (filters.category === 'all') {
          // /api/products supports q, page, per_page, lang
          url = new URL(`${API_BASE}/products`);
          url.searchParams.set('per_page', String(ITEMS_PER_PAGE));
          url.searchParams.set('page', String(filters.page));
          url.searchParams.set('lang', lang);
          if (filters.searchTerm) url.searchParams.set('q', filters.searchTerm);
          // If you want only active:
          // url.searchParams.set('active', '1');
        } else {
          // /api/categories/{slug}/products supports per_page, page, active, lang
          url = new URL(`${API_BASE}/categories/${filters.category}/products`);
          url.searchParams.set('per_page', String(ITEMS_PER_PAGE));
          url.searchParams.set('page', String(filters.page));
          url.searchParams.set('lang', lang);
          // optional: url.searchParams.set('active','1');
          // NOTE: byCategory doesn't support 'q' in backend; we'll filter client-side below if needed
        }

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to load products');
        const json = await res.json();

        const items = Array.isArray(json?.data) ? json.data : [];

        // Map API → UI (include both legacy fields and full raw data)
        const mapped = items.map((p) => ({
          // legacy fields used by existing grid/card
          id: p.id,
          title: p?.translated?.title ?? p.title ?? '',
          cat: p.category?.slug || 'uncategorized',
          price: Number(p.price ?? 0),
          rating: p.rating == null ? 0 : Number(p.rating),
          img: p.coverUrl || p.images?.[0]?.url || '',

          // richer fields for the new ProductCard
          coverUrl: p.coverUrl,
          images: p.images,
          category: p.category,
          translated: p.translated,
          slug: p.slug,
          description: p?.translated?.description ?? p.description ?? '',

          // flags your sorter expects
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
    return () => {
      alive = false;
    };
  }, [filters.category, filters.page, filters.searchTerm, i18n.language]);

  const handleFilterChange = (newFilter) => setFilters(newFilter);
  const handleCategoryChange = (newCategory) => setFilters({ cat: newCategory });
  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side filter/sort over the current page results
  const filteredAndSortedProducts = useMemo(() => {
    let products = apiItems.slice();

    // If using /categories/{slug}/products, 'q' isn't server-filtered → filter here
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

  // Since we now use server-side pagination, the page slice is already handled by the API.
  const paginatedProducts = filteredAndSortedProducts;

  // Use API-reported last_page for pagination controls
  const totalPages = serverPages;

  // Dynamic max price for FiltersBar based on current dataset/page
  const maxPrice = useMemo(() => {
    const max = Math.max(0, ...apiItems.map((p) => p.price));
    return Math.max(20, Math.ceil(max));
  }, [apiItems]);

  return (
    <div className="section-container pb-24">
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <div className="text-center mb-12">
          <h1 className="section-title">{t('catalog_shell_title')}</h1>
          <p className="section-subtitle mx-auto mt-4">{t('catalog_shell_subtitle')}</p>
          <Link to="/catalog" className="text-amber-orange hover:underline mt-4 inline-block">
            {t('catalog_change_category')}
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
