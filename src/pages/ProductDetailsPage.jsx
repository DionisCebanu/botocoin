import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Frown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import ImageGallery from '@/components/details/ImageGallery';
import AddToCartBar from '@/components/details/AddToCartBar';
import Breadcrumbs from '@/components/details/Breadcrumbs';
import RelatedProducts from '@/components/details/RelatedProducts';
import ProductInfo from '@/components/details/ProductInfo';
import NavWave from '../components/ui/NavWave';
import { Button } from '@/components/ui/button';

/* const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'; */
const API_BASE = import.meta.env.VITE_API_BASE || "https://event-api.dioniscode.com/public/api";

// normalize 'en-US' -> 'en', 'fr-CA' -> 'fr'
const normalizeLang = (l) => {
  if (!l) return null;
  const lc = String(l).toLowerCase();
  if (lc.startsWith('fr')) return 'fr';
  if (lc.startsWith('en')) return 'en';
  return null;
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Map API payload -> UI shape
  function mapApiToUi(p) {
    const title = p?.translated?.title ?? p?.title ?? '';
    const description = p?.translated?.description ?? p?.description ?? '';

    const imageUrls =
      Array.isArray(p.images) && p.images.length
        ? p.images.map((i) => i.url)
        : (p.coverUrl ? [p.coverUrl] : []);

    return {
      id: p.id,
      title,
      description,
      price: Number(p.price ?? 0), // will be overridden by selected variant
      fromPrice: typeof p.fromPrice === 'number' ? Number(p.fromPrice) : Number(p.price ?? 0),
      cat: p.category?.slug || 'uncategorized',
      img: imageUrls[0] || '/img/promo/hero-1.png',
      images: imageUrls,
      rating: p.rating === null || p.rating === undefined ? 0 : Number(p.rating),
      reviewCount: 0,
      _raw: p,
    };
  }

  // Pick default variant: prefer is_default, else cheapest
  function pickDefaultVariant(vs) {
    if (!vs || !vs.length) return null;
    const explicit = vs.find(v => v.is_default);
    if (explicit) return explicit;
    return [...vs].sort((a, b) => Number(a.price) - Number(b.price))[0];
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');

    const lang = normalizeLang(i18n.language) || 'en';

    fetch(`${API_BASE}/products/${id}?lang=${lang}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load product');
        return res.json();
      })
      .then((json) => {
        if (!alive) return;

        const mapped = mapApiToUi(json);
        setItem(mapped);

        const vs = Array.isArray(json.variants)
          ? json.variants.map((v) => ({
              id: v.id,
              name: v.name,
              quantity: v.quantity ?? null,
              translation_key: v.translation_key ?? null,
              price: Number(v.price),
              compare_at_price: v.compare_at_price !== null ? Number(v.compare_at_price) : null,
              is_default: !!v.is_default,
            }))
          : [];

        setVariants(vs);

        const def = pickDefaultVariant(vs);
        setSelectedVariantId(def ? def.id : null);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || 'Failed to load product');
        setItem(null);
        setVariants([]);
        setSelectedVariantId(null);
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [id, i18n.language]);

  const selectedVariant = useMemo(
    () => variants.find(v => v.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  );

  // Item view-model with variant price override
  const viewItem = useMemo(() => {
    if (!item) return null;
    if (!selectedVariant) return item;
    return {
      ...item,
      price: Number(selectedVariant.price),
      promo_price: selectedVariant.compare_at_price ?? null,
      selectedVariant,
    };
  }, [item, selectedVariant]);

  const handleBackToResults = () => {
    navigate(`/catalog${location.state?.from || ''}`);
  };

  if (loading) {
    return (
      <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
        <div className="section-container pb-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-12"></div>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <div className="aspect-[4/3] bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                <div className="flex gap-4 mt-4">
                  <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !viewItem) {
    return (
      <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
        <div className="section-container text-center flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
          <Frown className="h-24 w-24 text-amber-orange" />
          <h1 className="section-title mt-8">{t('product_details_not_found_title')}</h1>
          <p className="section-subtitle mt-4 mx-auto">
            {error || t('product_details_not_found_desc')}
          </p>
          <Button asChild className="mt-8">
            <Link to="/catalog">{t('product_details_back_to_catalog')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: t('breadcrumbs_home'), href: '/' },
    { label: t('nav_catalog'), href: '/catalog' },
    { label: t(`catalog_gate_${viewItem.cat}`), href: `/catalog?cat=${viewItem.cat}` },
    { label: viewItem.title }
  ];

  // JSON-LD: Offer for single variant, AggregateOffer for multiple
  const offersJsonLd = variants.length > 1
    ? {
        "@type": "AggregateOffer",
        "priceCurrency": "CAD",
        "lowPrice": Math.min(...variants.map(v => v.price)).toFixed(2),
        "highPrice": Math.max(...variants.map(v => v.price)).toFixed(2),
        "offerCount": variants.length
      }
    : {
        "@type": "Offer",
        "priceCurrency": "CAD",
        "price": (viewItem.price ?? 0).toFixed(2),
        "availability": "https://schema.org/InStock",
        "url": typeof window !== 'undefined' ? window.location.href : ''
      };

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": viewItem.title,
    "image": viewItem.images?.[0] || viewItem.img,
    "description": viewItem.description,
    "brand": { "@type": "Brand", "name": "Le Botocoin" },
    "offers": offersJsonLd,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": viewItem.rating || 0,
      "reviewCount": viewItem.reviewCount || 0
    }
  };

  const VariantSelector = () => {
    if (!variants.length) return null;
    return (
      <div className="mt-4">
        <div className="text-sm font-semibold text-warm-gray dark:text-soft-cream mb-2">
          {t('variant_select_label', { defaultValue: 'Choose an option' })}
        </div>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const active = v.id === selectedVariantId;
            return (
              <button
                key={v.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedVariantId(v.id)}
                className={[
                  "px-3 py-2 rounded-xl border transition",
                  active
                    ? "bg-chocolate-brown text-white border-chocolate-brown"
                    : "bg-white/80 dark:bg-neutral-800 text-chocolate-brown dark:text-soft-cream border-neutral-300 dark:border-neutral-700 hover:border-chocolate-brown/60"
                ].join(' ')}
                title={v.name}
              >
                <span className="text-sm font-medium">{v.name}</span>
                <span className="ml-2 text-sm opacity-80">
                  {v.compare_at_price
                    ? (<><span className="line-through mr-1">${Number(v.compare_at_price).toFixed(2)}</span><span>${Number(v.price).toFixed(2)}</span></>)
                    : <>${Number(v.price).toFixed(2)}</>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{viewItem.title} - Le Botocoin</title>
        <meta name="description" content={viewItem.description} />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>
      <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
        <AnimatedSection as="div" className="section-container pb-24">
          <motion.div variants={containerVariants}>
            <motion.button
              variants={itemVariants}
              onClick={handleBackToResults}
              className="flex items-center gap-2 font-semibold text-warm-gray hover:text-chocolate-brown dark:hover:text-soft-cream transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('product_details_back_to_results')}
            </motion.button>

            <motion.div variants={itemVariants}>
              <Breadcrumbs items={breadcrumbItems} />
            </motion.div>

            <div className="mt-8 grid md:grid-cols-2 gap-12 lg:gap-20">
              <motion.div variants={itemVariants}>
                <ImageGallery images={viewItem.images?.length ? viewItem.images : [viewItem.img]} alt={viewItem.title} />
              </motion.div>

              <motion.div variants={itemVariants} className="sticky top-28 h-fit">

                {variants.length > 1 && !selectedVariant && (
                  <div className="text-sm text-warm-gray">
                    {t('price_from', { defaultValue: 'From' })} ${viewItem.fromPrice.toFixed(2)}
                  </div>
                )}


                <ProductInfo item={viewItem} />
                <VariantSelector />
                {/* <AddToCartBar item={viewItem} /> */}
              </motion.div>
            </div>
          </motion.div>
        </AnimatedSection>

        <div aria-hidden className="relative bottom-[-20px] sm:bottom-[-40px] z-30">
          <NavWave className="block w-full h-6 md:h-10 bottom-[-40px] text-soft-cream dark:text-dark-bg opacity-90" />
        </div>

        <RelatedProducts currentItemId={viewItem.id} category={viewItem.cat} />
      </div>
    </>
  );
};

export default ProductDetailsPage;
