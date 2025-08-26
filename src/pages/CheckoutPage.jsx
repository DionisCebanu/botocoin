
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import MapCard from '@/components/MapCard';
import PickupTimePicker from '@/components/checkout/PickupTimePicker';
import ConfirmationModal from '@/components/checkout/ConfirmationModal';
import OrderSuccess from '@/components/checkout/OrderSuccess';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { items, subtotal, count, clear } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [pickupTime, setPickupTime] = useState({ date: new Date(), time: '' });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  useEffect(() => {
    if (count === 0 && !orderPlaced) {
      toast({
        title: t('checkout_error_cart_empty'),
        description: t('checkout_error_cart_empty_desc'),
        variant: 'destructive',
      });
      navigate('/catalog');
    }
  }, [count, navigate, t, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!pickupTime.date) newErrors.date = "Pickup date is required";
    if (!pickupTime.time) newErrors.time = "Pickup time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(true);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmOrder = () => {
    const newOrderId = `LB${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    setIsModalOpen(false);
    setOrderPlaced(true);
    clear();
    window.scrollTo(0, 0);
  };

  if (orderPlaced) {
    return <OrderSuccess orderId={orderId} pickupTime={pickupTime} />;
  }

  return (
    <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
      <Helmet>
        <title>{t('checkout_title')} - Le Botocoin</title>
      </Helmet>
      <AnimatedSection className="section-container pb-24">
        <motion.div variants={itemVariants}>
          <Button asChild variant="link" className="pl-0 mb-4 text-warm-gray">
            <Link to="/cart"><ArrowLeft className="w-4 h-4 mr-2" />{t('checkout_back_to_cart')}</Link>
          </Button>
          <h1 className="section-title mb-8">{t('checkout_title')}</h1>
        </motion.div>
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-12">
          <motion.div variants={containerVariants} className="lg:col-span-2 space-y-12">
            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft">
              <h2 className="text-2xl font-bold font-display mb-1">{t('checkout_contact_info')}</h2>
              <p className="text-warm-gray mb-6">{t('checkout_contact_info_desc')}</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">{t('form_name_label')}*</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">{t('form_phone_label')}*</label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">{t('form_email_label')}</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft">
              <h2 className="text-2xl font-bold font-display mb-1">{t('checkout_pickup_time')}</h2>
              <p className="text-warm-gray mb-6">{t('checkout_pickup_time_desc')}</p>
              <PickupTimePicker value={pickupTime} onChange={setPickupTime} errors={errors} />
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft">
              <label htmlFor="notes" className="text-2xl font-bold font-display mb-1">{t('checkout_notes')}</label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder={t('checkout_notes_placeholder')} className="mt-4" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft sticky top-28">
              <h2 className="text-2xl font-bold font-display mb-6">{t('checkout_order_summary')}</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold">{item.qty}x</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-chocolate-brown/10 dark:border-warm-gray/20">
                <div className="flex justify-between"><span>{t('cart_subtotal')}</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>{t('cart_taxes')}</span><span className="font-semibold">${taxes.toFixed(2)}</span></div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-chocolate-brown/10 dark:border-warm-gray/20"><span>{t('cart_total')}</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="mt-8">
                <div className="h-48 rounded-2xl overflow-hidden shadow-inner">
                  <MapCard />
                </div>
                <a href="https://www.openstreetmap.org/?mlat=45.5686&mlon=-73.5414#map=16/45.5686/-73.5414" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-warm-gray hover:text-amber-orange mt-2">
                  <MapPin className="w-4 h-4" /> {t('checkout_get_directions')}
                </a>
              </div>
              <Button type="submit" size="lg" className="w-full mt-8">{t('checkout_place_order')}</Button>
              <p className="text-xs text-warm-gray text-center mt-2">{t('checkout_payment_notice')}</p>
            </div>
          </motion.div>
        </form>
      </AnimatedSection>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
        formData={formData}
        pickupTime={pickupTime}
      />
    </div>
  );
};

export default CheckoutPage;
