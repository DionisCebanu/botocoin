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

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => onFilterChange({ q: searchTerm }), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Sync from URL
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

  const sortOptions = useMemo(
    () => [
      { value: 'popular', label: t('filters_sort_popular') },
      { value: 'price_asc', label: t('filters_sort_price_asc') },
      { value: 'price_desc', label: t('filters_sort_price_desc') },
      { value: 'newest', label: t('filters_sort_newest') },
    ],
    [t],
  );

  return (
    <div
      className="
        bg-white dark:bg-dark-surface rounded-3xl shadow-soft
        border border-chocolate-brown/10 backdrop-blur
        px-3 py-3 sm:px-4 sm:py-4 mb-8 sm:mb-12
      "
    >
      {/* Grid responsive : propre en desktop, empilé en mobile */}
      <div
        className="
           grid grid-cols-1 gap-2 sm:gap-3 md:gap-4
           md:flex md:flex-nowrap md:items-center md:justify-around
        "
      >
        {/* Search */}
        <div className="md:basis-[28%] md:max-w-[520px] w-full">
          <div className="relative">
            <Input
              type="text"
              placeholder={t('filters_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                h-12 pl-10 pr-4 rounded-full w-full
                bg-soft-cream/50 dark:bg-dark-bg/60
                border-0 ring-1 ring-chocolate-brown/10
                focus-visible:ring-2 focus-visible:ring-amber-orange
              "
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray pointer-events-none" />
          </div>
        </div>

        {/* Price (pills + slider centré) */}
        <div className="md:basis-[40%] w-full">
          <div
            className="
              rounded-full ring-1 ring-chocolate-brown/10
              bg-soft-cream/40 dark:bg-dark-bg/60
              px-3 sm:px-4
            "
          >
            {/* Empilé sur mobile, en ligne dès sm */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-2">
              <span className="text-xs sm:text-sm font-medium text-warm-gray whitespace-nowrap">
                {t('filters_price_range')}
              </span>

              <div className="flex-1 sm:min-w-[140px]">
                {/* Classe custom pour épaisseur/position */}
                <Slider
                  className="slider-compact"
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={(value) => onFilterChange({ price: value })}
                  max={maxPrice}
                  step={1}
                />
              </div>

              <span className="text-xs sm:text-sm font-semibold text-chocolate-brown dark:text-soft-cream whitespace-nowrap">
                ${priceRange[0]} — ${priceRange[1]}
              </span>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="md:basis-[18%] md:max-w-[260px] w-full">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger
              className="
                h-12 w-full rounded-full pl-4 pr-10
                bg-soft-cream/50 dark:bg-dark-bg/60
                border-0 ring-1 ring-chocolate-brown/10
                focus:ring-2 focus:ring-amber-orange
              "
            >
              <SelectValue placeholder={t('filters_sort_by')} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear (pousse à droite en desktop) */}
        <div className="md:basis-auto md:self-center">
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="
              h-12 rounded-full px-3 sm:px-4
              text-warm-gray hover:bg-red-50 dark:hover:bg-red-400/10 hover:text-red-600
              flex items-center gap-2
            "
          >
            <X className="h-4 w-4" />
            <span className="sm:inline">{t('filters_clear')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
