
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, formData, pickupTime }) => {
  const { t } = useTranslation();
  const { items, subtotal } = useCart();
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display">{t('confirmation_modal_title')}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="p-4 bg-soft-cream/50 dark:bg-dark-bg rounded-lg">
            <h3 className="font-bold mb-2">{t('confirmation_modal_pickup_time')}</h3>
            <p>{format(pickupTime.date, 'PPP')} @ {pickupTime.time}</p>
          </div>
          <div className="p-4 bg-soft-cream/50 dark:bg-dark-bg rounded-lg">
            <h3 className="font-bold mb-2">{t('confirmation_modal_contact_info')}</h3>
            <p>{formData.name}</p>
            <p>{formData.phone}</p>
            {formData.email && <p>{formData.email}</p>}
          </div>
          <div>
            <h3 className="font-bold mb-2">{t('checkout_order_summary')}</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.qty}x {item.title}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
              <span>{t('cart_total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-center text-sm text-warm-gray">{t('confirmation_modal_payment_notice')}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">{t('confirmation_modal_edit')}</Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm}>{t('confirmation_modal_confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
