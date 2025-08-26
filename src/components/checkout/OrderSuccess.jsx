
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import { itemVariants } from '@/lib/animations';

const OrderSuccess = ({ orderId, pickupTime }) => {
  const { t } = useTranslation();
  const address = "3881 Rue Rachel E Local 5, Montréal, QC H1X 1Z2";

  const generateIcsFile = () => {
    const event = {
      title: `Pickup Order #${orderId} at Le Botocoin`,
      description: `Your order will be ready for pickup. Total: $XX.XX. Payment at the restaurant.`,
      location: address,
      startTime: format(new Date(`${format(pickupTime.date, 'yyyy-MM-dd')}T${pickupTime.time}`), "yyyyMMdd'T'HHmmss"),
      endTime: format(new Date(new Date(`${format(pickupTime.date, 'yyyy-MM-dd')}T${pickupTime.time}`).getTime() + 30 * 60000), "yyyyMMdd'T'HHmmss"),
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${orderId}@lebotocoin.com
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}
DTSTART:${event.startTime}
DTEND:${event.endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `order-${orderId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-24 bg-soft-cream dark:bg-dark-bg min-h-screen">
      <Helmet>
        <title>{t('order_success_title')} - Le Botocoin</title>
      </Helmet>
      <div className="section-container flex items-center justify-center h-[calc(100vh-6rem)]">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-dark-surface p-8 md:p-12 rounded-2xl shadow-soft text-center max-w-2xl w-full"
        >
          <CheckCircle className="h-20 w-20 text-green-leaf mx-auto" />
          <h1 className="section-title mt-6">{t('order_success_title')}</h1>
          <p className="text-warm-gray mt-2">{t('order_success_subtitle', { orderId })}</p>

          <div className="text-left bg-soft-cream/50 dark:bg-dark-bg p-6 rounded-lg mt-8 space-y-4">
            <h2 className="font-bold text-lg">{t('order_success_pickup_instructions')}</h2>
            <div>
              <h3 className="font-semibold">{t('order_success_pickup_address')}</h3>
              <p className="text-warm-gray flex items-center gap-2"><MapPin className="w-4 h-4" /> {address}</p>
            </div>
            <div>
              <h3 className="font-semibold">{t('order_success_pickup_time')}</h3>
              <p className="text-warm-gray flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(pickupTime.date, 'PPP')} @ {pickupTime.time}</p>
            </div>
            <p className="text-sm text-warm-gray pt-4 border-t border-chocolate-brown/10 dark:border-warm-gray/20">{t('order_success_payment_notice')}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={generateIcsFile} variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              {t('order_success_add_to_calendar')}
            </Button>
            <Button asChild>
              <Link to="/">{t('order_success_back_home')}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
