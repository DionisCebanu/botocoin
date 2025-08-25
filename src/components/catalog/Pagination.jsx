import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation();
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const pageNumbers = [];
    // Logic for displaying page numbers (e.g., with ellipsis)
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        const pages = [];
        pages.push(1);
        
        if (currentPage > 3) pages.push('...');
        
        if (currentPage > 2) pages.push(currentPage - 1);
        if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
        if (currentPage < totalPages - 1) pages.push(currentPage + 1);
        
        if (currentPage < totalPages - 2) pages.push('...');
        
        pages.push(totalPages);
        
        // Remove duplicates and ensure unique '...' keys
        const uniquePages = [];
        let lastItem = null;
        for (const page of pages) {
            if (page === '...' && lastItem === '...') continue;
            uniquePages.push(page);
            lastItem = page;
        }

        return uniquePages;
    };
    
    const pageLinks = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-4 mt-12" aria-label="Pagination">
            <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrev}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('pagination_prev')}
            </Button>

            <div className="hidden sm:flex items-center space-x-2">
                {pageLinks.map((page, index) =>
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-4 py-2">...</span>
                    ) : (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    )
                )}
            </div>

            <p className="sm:hidden text-sm font-medium text-warm-gray">
              {t('pagination_page', { currentPage, totalPages })}
            </p>

            <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
            >
                {t('pagination_next')}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
};

export default Pagination;