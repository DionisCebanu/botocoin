import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MapPin, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import MapCard from '@/components/MapCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

// ✅ products
import allProducts from '@/data/allProducts.json';

/* ------------------------------ Storage utils ------------------------------ */
const KEY = 'botocoin_cart_ids';

// Read BOTH formats:
//   A) plain array: ["11","2","11"]
//   B) persist shape: { state: { itemIds: [1,2,3] }, version: 0 }
const readRaw = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};
const readShape = () => {
  const raw = readRaw();
  if (Array.isArray(raw)) return { shape: 'array', ids: raw.map(String), raw };
  if (raw && typeof raw === 'object' && Array.isArray(raw.state?.itemIds)) {
    return { shape: 'persist', ids: raw.state.itemIds.map(String), raw };
  }
  // legacy map: { "12": 2, "7": 1 }
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const ids = Object.entries(raw).flatMap(([id, qty]) =>
      Array(Number(qty) || 0).fill(String(id))
    );
    return { shape: 'array', ids, raw: ids };
  }
  return { shape: 'array', ids: [], raw: [] };
};

// Write back to the SAME format we read to avoid fighting your context
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

const toGrouped = (ids) =>
  (Array.isArray(ids) ? ids : []).reduce((m, id) => {
    const k = String(id);
    m[k] = (m[k] || 0) + 1;
    return m;
  }, {});

/* --------------------------------- UI parts -------------------------------- */
const CartRow = ({ product, qty, onDec, onInc, onRemove }) => {
  const { t } = useTranslation();
  return (
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-chocolate-brown/10 dark:border-warm-gray/20">
      <img src={product.img || product.images?.[0]} alt={product.title} className="w-full sm:w-40 h-32 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-grow w-full text-center sm:text-left">
        <p className="text-xs text-warm-gray uppercase tracking-wider">{product.cat || product.category}</p>
        <Link to={`/details/${product.id}`} className="font-bold text-lg hover:text-amber-orange transition-colors">{product.title}</Link>
        <p className="text-sm font-semibold mt-1">${Number(product.price).toFixed(2)}</p>
        <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
          {[...Array(Math.floor(product.rating || 0))].map((_, i) => <Star key={i} size={14} className="text-amber-orange fill-current" />)}
          {[...Array(5 - Math.floor(product.rating || 0))].map((_, i) => <Star key={i} size={14} className="text-amber-orange/30" />)}
          {product.rating && <span className="text-xs text-warm-gray">({Number(product.rating).toFixed(1)})</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="outline" size="icon" onClick={onDec} aria-label="Decrease quantity">-</Button>
        <Input type="number" value={qty} readOnly className="w-16 h-10 text-center" aria-label={`Quantity for ${product.title}`} />
        <Button variant="outline" size="icon" onClick={onInc} aria-label="Increase quantity">+</Button>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} aria-label={`Remove ${product.title}`} className="flex-shrink-0">
        <X className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

const CartPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]); // [{ product, qty }]

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
  const taxes     = subtotal * 0.15;
  const total     = subtotal + taxes;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!rows.length) {
      toast({ title: t('cart_empty', 'Your cart is empty') });
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsModalOpen(false);
    toast({
      title: t('order_placed_title', 'Order placed!'),
      description: t('checkout_payment_notice', 'Payment will be made in person at the restaurant.')
    });
    // Optionally clear after placing:
    // writeIds([], readShape().shape);
  };

  return (
    <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
      <Helmet><title>{t('cart_title')} - Le Botocoin</title></Helmet>

      <AnimatedSection className="section-container pb-24">
        <motion.div variants={itemVariants}>
          <h1 className="section-title mb-8">{t('cart_title')} ({itemCount})</h1>
        </motion.div>

        {!rows.length ? (
          <div className="text-center py-20">
            <p className="text-warm-gray mb-4">{t('cart_empty', 'Your cart is empty')}</p>
            <Link to="/catalog" className="btn-primary">{t('back_to_catalog', 'Back to Catalog')}</Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-12">
            {/* Left: items */}
            <motion.div variants={containerVariants} className="lg:col-span-2">
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
              <div className="mt-8 p-6 bg-white dark:bg-dark-surface rounded-2xl shadow-soft">
                <div className="flex justify-between">
                  <span>{t('cart_subtotal')}</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart_taxes')}</span>
                  <span className="font-semibold">${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 mt-2 border-t">
                  <span>{t('cart_total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Right: contact + map */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft sticky top-28">
                <h2 className="text-2xl font-bold font-display mb-6">{t('checkout_contact_info')}</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">{t('form_name_label')}</label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-sm font-medium mb-1">{t('form_surname_label', 'Surname')}</label>
                    <Input id="surname" name="surname" value={formData.surname} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">{t('form_email_label')}</label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">{t('form_phone_label')}</label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="h-48 rounded-2xl overflow-hidden shadow-inner">
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

                <Button type="submit" size="lg" className="w-full mt-8">{t('checkout_place_order')}</Button>
                <p className="text-xs text-warm-gray text-center mt-2">{t('checkout_payment_notice')}</p>
              </div>
            </motion.div>
          </form>
        )}
      </AnimatedSection>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('confirmation_modal_title')}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <p><strong>{t('form_name_label')}:</strong> {formData.name} {formData.surname}</p>
            <p><strong>{t('form_phone_label')}:</strong> {formData.phone}</p>
            {formData.email && <p><strong>{t('form_email_label')}:</strong> {formData.email}</p>}
            <p className="font-bold text-lg mt-4">Total: ${total.toFixed(2)}</p>
            <p className="text-sm text-warm-gray">{t('checkout_payment_notice')}</p>
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
