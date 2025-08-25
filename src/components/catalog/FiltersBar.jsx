import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const FiltersBar = ({ filters, onFilterChange, maxPrice }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
    const [priceRange, setPriceRange] = useState(filters.priceRange);
    
    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange({ q: searchTerm });
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Update internal state if filters change from URL
    useEffect(() => {
        setSearchTerm(filters.searchTerm);
        setPriceRange(filters.priceRange);
    }, [filters.searchTerm, filters.priceRange]);

    const handleSortChange = (value) => onFilterChange({ sort: value });

    const handleClearFilters = () => {
        setSearchTerm('');
        setPriceRange([0, maxPrice]);
        onFilterChange({ q: '', price: `0,${maxPrice}`, sort: 'popular' });
    };

    const sortOptions = useMemo(() => [
        { value: 'popular', label: t('filters_sort_popular') },
        { value: 'price_asc', label: t('filters_sort_price_asc') },
        { value: 'price_desc', label: t('filters_sort_price_desc') },
        { value: 'newest', label: t('filters_sort_newest') },
    ], [t]);

    return (
        <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl shadow-soft mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="relative">
                    <Input 
                        type="text"
                        placeholder={t('filters_search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 !h-12"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
                </div>
                <div className="lg:col-span-1">
                    <label className="text-sm font-medium text-warm-gray block mb-2">{t('filters_price_range')}: ${priceRange[0]} - ${priceRange[1]}</label>
                    <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        onValueCommit={(value) => onFilterChange({ price: value })}
                        max={maxPrice}
                        step={1}
                    />
                </div>
                <div>
                     <Select value={filters.sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full !h-12">
                            <SelectValue placeholder={t('filters_sort_by')} />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Button variant="ghost" onClick={handleClearFilters} className="w-full !h-12 text-warm-gray hover:bg-red-500/10 hover:text-red-600">
                        <X className="mr-2 h-4 w-4" />
                        {t('filters_clear')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FiltersBar;