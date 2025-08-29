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

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';
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

    if (newFilters.page === undefined) currentParams.set('page', '1');
    setSearchParams(currentParams);
  }, [searchParams, setSearchParams]);

  return [filters, setFilters];
};

export default function CatalogShell() {
  const { t } = useTranslation();
  const [filters, setFilters] = useProductFilters();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiItems, setApiItems] = useState([]); // mapped UI shape

  // Fetch products when category changes (all vs specific category)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const fetchProducts = async () => {
      try {
        let url;
        if (filters.category === 'all') {
          url = new URL(`${API_BASE}/products`);
          // you could also pass q/active here if you want server filtering
        } else {
          url = new URL(`${API_BASE}/categories/${filters.category}/products`);
        }

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to load products');
        const json = await res.json();

        const items = Array.isArray(json?.data) ? json.data : [];
        // Map API → UI shape your grid expects
        const mapped = items.map((p) => ({
          id: p.id,
          title: p.title,
          cat: p.category?.slug || 'uncategorized',
          price: Number(p.price ?? 0),
          rating: p.rating === null || p.rating === undefined ? 4 : Number(p.rating),
          img: p.coverUrl || '',  // used by ProductsGrid
          popular: false,         // not in API; default
          newest: false,          // not in API; default
          _raw: p,
        }));

        if (alive) setApiItems(mapped);
      } catch (err) {
        if (alive) {
          setError(err.message || 'Failed to load products');
          setApiItems([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProducts();
    return () => { alive = false; };
  }, [filters.category]);

  const handleFilterChange = (newFilter) => setFilters(newFilter);
  const handleCategoryChange = (newCategory) => setFilters({ cat: newCategory });
  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side filter/sort (same logic you had)
  const filteredAndSortedProducts = useMemo(() => {
    let products = apiItems.slice();

    // Search
    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      products = products.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Price
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
  }, [apiItems, filters.searchTerm, filters.priceRange, filters.sortBy]);

  // Pagination (client-side)
  const paginatedProducts = useMemo(() => {
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filters.page, filteredAndSortedProducts]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE
  );

  // Dynamic max price for FiltersBar based on current dataset
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
