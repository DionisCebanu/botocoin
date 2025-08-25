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

const allProducts = [
    {id: 1, title: 'Classic Sugar', cat: 'donuts', price: 2.50, rating: 4.8, img: '/img/catalog/hero-1.png', newest: true},
    {id: 2, title: 'Chocolate Glaze', cat: 'donuts', price: 3.00, rating: 4.9, img: '/img/catalog/hero-2.png'},
    {id: 3, title: 'Banana Cream', cat: 'donuts', price: 3.50, rating: 4.7, img: '/img/catalog/hero-3.png', popular: true},
    {id: 4, title: 'Hibiscus Ring', cat: 'donuts', price: 3.25, rating: 4.6, img: '/img/catalog/hero-4.png', newest: true},
    {id: 5, title: 'Spiced Delight', cat: 'donuts', price: 3.00, rating: 4.5, img: '/img/catalog/hero-5.png'},
    {id: 6, title: 'Caramel Filled', cat: 'donuts', price: 3.75, rating: 4.9, img: '/img/catalog/hero-6.png', popular: true},
    {id: 7, title: 'Ginger Juice', cat: 'drinks', price: 4.50, rating: 4.9, img: '/img/catalog/hero-2.png', popular: true, newest: true},
    {id: 8, title: 'Bissap (Hibiscus)', cat: 'drinks', price: 4.00, rating: 4.8, img: '/img/catalog/hero-3.png'},
    {id: 9, title: 'Mango Smoothie', cat: 'drinks', price: 5.00, rating: 4.7, img: '/img/catalog/hero-4.png'},
    {id: 10, 'title': 'Fresh Mint Tea', 'cat': 'drinks', 'price': 3.00, 'rating': 4.6, 'img': '/img/catalog/hero-5.png'},
    {id: 11, 'title': 'Mini Donut Box', 'cat': 'donuts', 'price': 10.00, 'rating': 4.8, 'img': '/img/catalog/hero-6.png', popular: true},
    {id: 12, 'title': 'Coconut Dream', 'cat': 'donuts', 'price': 3.50, 'rating': 4.7, 'img': '/img/catalog/hero-3.png'},
    {id: 13, 'title': 'Iced Coffee', 'cat': 'drinks', 'price': 4.75, 'rating': 4.8, 'img': '/img/catalog/hero-2.png', newest: true},
    {id: 14, 'title': 'Assortment Box', 'cat': 'donuts', 'price': 15.00, 'rating': 4.9, 'img': '/img/catalog/hero-4.png'},
    {id: 15, 'title': 'Passion Fruit Juice', 'cat': 'drinks', 'price': 4.50, 'rating': 4.9, 'img': '/img/catalog/hero-5.png'},
];

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
            if (value === undefined || value === null || (typeof value === 'string' && value === '')) {
                currentParams.delete(key);
            } else {
                currentParams.set(key, Array.isArray(value) ? value.join(',') : value);
            }
        });

        // Reset page on filter change
        if (newFilters.page === undefined) {
             currentParams.set('page', '1');
        }

        setSearchParams(currentParams);
    }, [searchParams, setSearchParams]);

    return [filters, setFilters];
};

const CatalogShell = () => {
    const { t } = useTranslation();
    const [filters, setFilters] = useProductFilters();

    const handleFilterChange = (newFilter) => {
        setFilters(newFilter);
    };

    const handleCategoryChange = (newCategory) => {
        setFilters({ cat: newCategory });
    }
    
    const handlePageChange = (newPage) => {
        setFilters({ page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const filteredAndSortedProducts = useMemo(() => {
        let products = allProducts;
        // Category
        if (filters.category && filters.category !== 'all') {
            products = products.filter(p => p.cat === filters.category);
        }
        // Search
        if (filters.searchTerm) {
            products = products.filter(p => p.title.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        }
        // Price
        products = products.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
        // Sort
        switch (filters.sortBy) {
            case 'price_asc': products.sort((a, b) => a.price - b.price); break;
            case 'price_desc': products.sort((a, b) => b.price - a.price); break;
            case 'newest': products.sort((a, b) => b.newest - a.newest); break;
            case 'popular':
            default: products.sort((a, b) => (b.popular || 0) - (a.popular || 0) || b.rating - a.rating); break;
        }
        return products;
    }, [filters, allProducts]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filters.page, filteredAndSortedProducts]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

    return (
        <div className="section-container pb-24">
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
                <div className="text-center mb-12">
                    <h1 className="section-title">{t('catalog_shell_title')}</h1>
                    <p className="section-subtitle mx-auto mt-4">{t('catalog_shell_subtitle')}</p>
                    <Link to="/catalog" className="text-amber-orange hover:underline mt-4 inline-block">{t('catalog_change_category')}</Link>
                </div>

                <CategoryTabs activeCategory={filters.category} onCategoryChange={handleCategoryChange} />
                <FiltersBar filters={filters} onFilterChange={handleFilterChange} maxPrice={20} />
            </motion.div>
            
            {paginatedProducts.length > 0 ? (
                <ProductsGrid products={paginatedProducts} />
            ) : (
                <div className="text-center py-20">
                    <Frown className="mx-auto h-16 w-16 text-warm-gray" />
                    <h3 className="mt-4 text-2xl font-semibold">{t('no_products_found')}</h3>
                    <p className="mt-2 text-warm-gray">{t('no_products_found_desc')}</p>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    );
};

export default CatalogShell;