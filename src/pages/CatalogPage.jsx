import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import CatalogGate from '@/components/catalog/CatalogGate';
import CatalogShell from '@/components/catalog/CatalogShell';

const CatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const category = searchParams.get('cat');

    const handleCategorySelect = (selectedCategory) => {
        setSearchParams({ cat: selectedCategory });
        localStorage.setItem('lastCatalogCategory', selectedCategory);
    };

    return (
        <>
            <Helmet>
                <title>{t('catalog_shell_title')} - Le Botocoin</title>
                <meta name="description" content={t('catalog_shell_subtitle')} />
            </Helmet>
            <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
                {!category ? (
                    <CatalogGate onSelectCategory={handleCategorySelect} />
                ) : (
                    <CatalogShell />
                )}
            </div>
        </>
    );
};

export default CatalogPage;