import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Star, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import MapCard from '@/components/MapCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import allProducts from '@/data/allProducts.json';

/* ------------------------------ Storage utils ------------------------------ */
const KEY = 'botocoin_cart_ids';
const readRaw = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const readShape = () => {
  const raw = readRaw();
  if (Array.isArray(raw)) return { shape: 'array', ids: raw.map(String), raw };
  if (raw && typeof raw === 'object' && Array.isArray(raw.state?.itemIds))
    return { shape: 'persist', ids: raw.state.itemIds.map(String), raw };
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const ids = Object.entries(raw).flatMap(([id, qty]) => Array(Number(qty) || 0).fill(String(id)));
    return { shape: 'array', ids, raw: ids };
  }
  return { shape: 'array', ids: [], raw: [] };
};
const writeIds = (ids, preferShape) => {
  const current = readShape();
  const shape = preferShape || current.shape;
  if (shape === 'persist') {
    const next = {
      ...(current.raw && typeof current.raw === 'object' ? current.raw : { version: 0 }),
      state: { ...(current.raw?.state || {}), itemIds: ids.map(id => (typeof id === 'number' ? id : Number(id) || String(id))) }
    };
    localStorage.setItem(KEY, JSON.stringify(next));
  } else {
    localStorage.setItem(KEY, JSON.stringify(ids.map(String)));
  }
  window.dispatchEvent(new Event('cart-updated'));
};
const setQtyForId = (id, qty) => {
  const { ids, shape } = readShape();
  const others = ids.filter(x => String(x) !== String(id));
  const next = [...others, ...Array(Math.max(0, qty | 0)).fill(String(id))];
  writeIds(next, shape);
};
const removeAllOfId = (id) => {
  const { ids, shape } = readShape();
  const next = ids.filter(x => String(x) !== String(id));
  writeIds(next, shape);
};
const toGrouped = (ids) => (Array.isArray(ids) ? ids : []).reduce((m, id) => ((m[String(id)] = (m[String(id)] || 0) + 1), m), {});
const money = (v) => `$${Number(v || 0).toFixed(2)}`;

/* --------------------------------- UI parts -------------------------------- */
const CartRow = ({ product, qty, onDec, onInc, onRemove }) => {
  const { t } = useTranslation();
  const rowTotal = Number(product.price || 0) * qty;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white dark:bg-dark-surface p-4 sm:p-5 shadow-soft hover:shadow-md transition"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={product.img || product.images?.[0]}
          alt={product.title}
          className="w-full sm:w-40 h-32 object-cover rounded-xl"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-2 py-0.5 text-[11px] uppercase tracking-wide">
                {product.cat || product.category}
              </span>
              <Link
                to={`/details/${product.id}`}
                className="block mt-1 font-semibold text-lg text-chocolate-brown dark:text-soft-cream hover:text-amber-orange truncate"
              >
                {product.title}
              </Link>

              <div className="mt-1 flex items-center gap-1 text-[13px]">
                {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                  <Star key={`f-${i}`} size={14} className="text-amber-orange fill-current" />
                ))}
                {[...Array(5 - Math.floor(product.rating || 0))].map((_, i) => (
                  <Star key={`e-${i}`} size={14} className="text-amber-orange/30" />
                ))}
                {product.rating && <span className="text-warm-gray">({Number(product.rating).toFixed(1)})</span>}
              </div>

              <p className="mt-2 text-sm text-warm-gray">
                {t('price', 'Unit')}: <span className="font-semibold text-chocolate-brown">{money(product.price)}</span>
              </p>
            </div>

            {/* per-item total on desktop */}
            <div className="hidden sm:block text-right">
              <p className="text-xs text-warm-gray">{t('row_total', 'Item total')}</p>
              <p className="text-lg font-bold text-chocolate-brown">{money(rowTotal)}</p>
            </div>
          </div>

          {/* controls + remove */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="inline-flex items-center rounded-full bg-soft-cream/70 dark:bg-dark-bg shadow-inner">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={onDec} aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                readOnly
                value={qty}
                aria-label={`Quantity for ${product.title}`}
                className="w-12 h-9 border-0 bg-transparent text-center font-medium focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={onInc} aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </Button>

              {/* remove moved here so it never overlaps price */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label={`Remove ${product.title}`}
                className="ml-1 rounded-full h-9 w-9 text-warm-gray hover:text-amber-orange"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* per-item total on mobile */}
            <div className="sm:hidden ml-auto text-right">
              <p className="text-xs text-warm-gray">{t('row_total', 'Item total')}</p>
              <p className="text-base font-bold text-chocolate-brown">{money(rowTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const CartPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const load = useCallback(() => {
    const { ids } = readShape();
    const grouped = toGrouped(ids);
    const merged = Object.entries(grouped)
      .map(([id, qty]) => {
        const p = allProducts.find(x => String(x.id) === String(id));
        return p ? { product: p, qty } : null;
      })
      .filter(Boolean);
    setRows(merged);
  }, []);

  useEffect(() => {
    load();
    const onChange = () => load();
    window.addEventListener('storage', onChange);
    window.addEventListener('cart-updated', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('cart-updated', onChange);
    };
  }, [load]);

  const itemCount = useMemo(() => rows.reduce((n, r) => n + r.qty, 0), [rows]);
  const subtotal  = useMemo(() => rows.reduce((s, r) => s + Number(r.product.price || 0) * r.qty, 0), [rows]);

  // 🇨🇦 Quebec + Federal taxes
  const gst = subtotal * 0.05;          // GST 5%
  const qst = subtotal * 0.09975;       // QST 9.975% (applied on price, not compounding)
  const taxes = gst + qst;
  const total = subtotal + taxes;

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!rows.length) return toast({ title: t('cart_empty', 'Your cart is empty') });
    setIsModalOpen(true);
  };
  const handleConfirmOrder = () => {
    setIsModalOpen(false);
    toast({ title: t('order_placed_title', 'Order placed!'), description: t('checkout_payment_notice', 'Payment will be made in person at the restaurant.') });
  };

  return (
    <div className="pt-24 bg-gradient-to-b from-soft-cream to-soft-cream/70 dark:from-dark-bg dark:to-dark-bg min-h-screen">
      <Helmet><title>{t('cart_title')} - Le Botocoin</title></Helmet>

      <AnimatedSection className="section-container pb-24">
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
          <h1 className="section-title">{t('cart_title')} <span className="text-amber-orange">({itemCount})</span></h1>
          <Link to="/catalog" className="inline-flex items-center gap-2 text-amber-orange hover:underline">
            <ArrowLeft className="h-4 w-4" /> {t('back_to_catalog', 'Back to Catalog')}
          </Link>
        </motion.div>

        {!rows.length ? (
          <div className="text-center py-24 rounded-2xl bg-white/90 dark:bg-dark-surface/90 shadow-soft">
            <p className="text-warm-gray mb-4">{t('cart_empty', 'Your cart is empty')}</p>
            <Link to="/catalog" className="btn-primary">{t('back_to_catalog', 'Back to Catalog')}</Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-10">
            {/* LEFT: items + summary */}
            <motion.div variants={containerVariants} className="lg:col-span-2 space-y-4">
              {rows.map(({ product, qty }) => (
                <CartRow
                  key={product.id}
                  product={product}
                  qty={qty}
                  onDec={() => setQtyForId(product.id, Math.max(0, qty - 1))}
                  onInc={() => setQtyForId(product.id, qty + 1)}
                  onRemove={() => removeAllOfId(product.id)}
                />
              ))}

              {/* Summary */}
              <div className="rounded-2xl bg-white dark:bg-dark-surface p-6 shadow-soft">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-warm-gray">{t('cart_subtotal')}</span><span className="font-semibold">{money(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-warm-gray">GST (5%)</span><span className="font-semibold">{money(gst)}</span></div>
                  <div className="flex justify-between"><span className="text-warm-gray">QST (9.975%)</span><span className="font-semibold">{money(qst)}</span></div>
                  <div className="flex justify-between"><span className="text-warm-gray">{t('cart_taxes', 'Taxes')}</span><span className="font-semibold">{money(taxes)}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-brown/10 flex justify-between items-center">
                  <span className="text-xl font-bold">{t('cart_total')}</span>
                  <span className="text-2xl font-extrabold text-chocolate-brown">{money(total)}</span>
                </div>
                <div className="mt-4">
                  <Link to="/catalog" className="text-amber-orange hover:underline">
                    {t('continue_shopping', 'Continue shopping')}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: contact + map (sticky) */}
            <motion.aside variants={itemVariants} className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl bg-white dark:bg-dark-surface p-8 shadow-md">
                <h2 className="text-2xl font-bold font-display mb-6">{t('checkout_contact_info')}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">{t('form_name_label')}</label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="h-11 focus-visible:ring-amber-500" placeholder="Jane" />
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-sm font-medium mb-1">{t('form_surname_label', 'Surname')}</label>
                    <Input id="surname" name="surname" value={formData.surname} onChange={handleInputChange} className="h-11 focus-visible:ring-amber-500" placeholder="Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">{t('form_email_label')}</label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="h-11 focus-visible:ring-amber-500" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">{t('form_phone_label')}</label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="h-11 focus-visible:ring-amber-500" placeholder="+1 (514) 000-0000" />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="h-48 rounded-xl overflow-hidden shadow-inner">
                    <MapCard />
                  </div>
                  <a
                    href="https://www.openstreetmap.org/?mlat=45.5686&mlon=-73.5414#map=16/45.5686/-73.5414"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-warm-gray hover:text-amber-orange mt-2"
                  >
                    <MapPin className="w-4 h-4" /> {t('checkout_get_directions')}
                  </a>
                </div>

                <Button type="submit" size="lg" className="w-full mt-8 h-12 text-base font-semibold shadow-sm">
                  {t('checkout_place_order')}
                </Button>
                <p className="text-xs text-warm-gray text-center mt-2">
                  {t('checkout_payment_notice')}
                </p>
              </div>
            </motion.aside>
          </form>
        )}
      </AnimatedSection>

      {/* Confirmation modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('confirmation_modal_title')}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-3 text-sm">
            <p><strong>{t('form_name_label')}:</strong> {formData.name} {formData.surname}</p>
            <p><strong>{t('form_phone_label')}:</strong> {formData.phone}</p>
            {formData.email && <p><strong>{t('form_email_label')}:</strong> {formData.email}</p>}
            <div className="mt-2 pt-3 border-t">
              <p className="text-warm-gray">{t('cart_total')}</p>
              <p className="text-xl font-bold">{money(total)}</p>
            </div>
            <p className="text-xs text-warm-gray">{t('checkout_payment_notice')}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary">{t('confirmation_modal_edit')}</Button></DialogClose>
            <Button onClick={handleConfirmOrder}>{t('confirmation_modal_confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
