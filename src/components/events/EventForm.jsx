import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { appearItem } from '@/lib/animations';
import { FileText, Loader2 } from 'lucide-react';

const EventForm = ({ eventType, selectedTier, onTierChange }) => {
  const { t } = useTranslation();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventType: eventType,
    date: '',
    time: '',
    guests: '',
    budgetPerPerson: selectedTier || '',
    venueAddress: '',
    dietaryNotes: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, budgetPerPerson: selectedTier }));
  }, [selectedTier]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'budgetPerPerson') {
      onTierChange(value);
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.phone) newErrors.phone = 'Required';
    if (!formData.date) newErrors.date = 'Required';
    if (!formData.time) newErrors.time = 'Required';
    if (!formData.guests) newErrors.guests = 'Required';
    if (!formData.consent) newErrors.consent = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({ variant: 'destructive', title: t('events.form.error_title') });
      return;
    }

    setIsSubmitting(true);

    // const serviceId = 'YOUR_EMAILJS_SERVICE_ID';
    // const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';
    // const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY';

    // emailjs.send(serviceId, templateId, formData, publicKey)
    //   .then((response) => {
    //     console.log('SUCCESS!', response.status, response.text);
    //     toast({ title: t('events.form.success_title'), description: t('events.form.success_desc') });
    //     formRef.current.reset();
    //     setFormData({ name: '', email: '', phone: '', organization: '', eventType: eventType, date: '', time: '', guests: '', budgetPerPerson: '', venueAddress: '', dietaryNotes: '', message: '', consent: false });
    //   }, (err) => {
    //     console.log('FAILED...', err);
    //     toast({ variant: 'destructive', title: 'Oops!', description: 'Something went wrong. Please try again.' });
    //   })
    //   .finally(() => {
    //     setIsSubmitting(false);
    //   });
    
    // Placeholder for EmailJS integration
    setTimeout(() => {
      console.log('Form data submitted:', formData);
      toast({ title: t('events.form.success_title'), description: t('events.form.success_desc') });
      formRef.current.reset();
      setFormData({ name: '', email: '', phone: '', organization: '', eventType: eventType, date: '', time: '', guests: '', budgetPerPerson: '', venueAddress: '', dietaryNotes: '', message: '', consent: false });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleNotImplemented = (feature) => {
    toast({
      title: `🚧 ${feature} is not implemented yet`,
      description: "But don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const budgetOptions = t('events.budget_options', { returnObjects: true });
  const selectedTierLabel = budgetOptions.find(opt => opt.value === selectedTier)?.label || '...';

  return (
    <motion.div variants={appearItem} id="event-form" className="relative">
      <div className="absolute -z-10 blur-3xl opacity-30 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300/40 to-rose-300/40 -top-20 -right-20" />
      <form ref={formRef} onSubmit={handleSubmit} className="bg-white/70 dark:bg-dark-surface/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-dark-surface/50 p-6 sm:p-8 rounded-2xl shadow-soft space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold font-display mb-2">{t('events.form.title')}</h3>
          {selectedTier && (
            <div className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-amber-800 bg-amber-100 rounded-full">
              {t(`events.${eventType}.hero.title`)}: {selectedTierLabel}
            </div>
          )}
        </div>
        
        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg mb-2">{t('checkout_contact_info')}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" placeholder={t('events.form.name') + '*'} value={formData.name} onChange={handleInputChange} className={errors.name ? 'border-red-500' : ''} />
            <Input name="email" type="email" placeholder={t('events.form.email') + '*'} value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-red-500' : ''} />
            <Input name="phone" placeholder={t('events.form.phone') + '*'} value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'border-red-500' : ''} />
            <Input name="organization" placeholder={t('events.form.organization')} value={formData.organization} onChange={handleInputChange} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg mb-2">{t('events.form.event_details')}</legend>
          <input type="hidden" name="eventType" value={formData.eventType} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="date" type="date" placeholder={t('events.form.date') + '*'} value={formData.date} onChange={handleInputChange} className={errors.date ? 'border-red-500' : ''} />
            <Input name="time" type="time" placeholder={t('events.form.time') + '*'} value={formData.time} onChange={handleInputChange} className={errors.time ? 'border-red-500' : ''} />
            <Input name="guests" type="number" placeholder={t('events.form.guests') + '*'} value={formData.guests} onChange={handleInputChange} className={errors.guests ? 'border-red-500' : ''} />
            <Select name="budgetPerPerson" onValueChange={(v) => handleSelectChange('budgetPerPerson', v)} value={formData.budgetPerPerson}>
              <SelectTrigger><SelectValue placeholder={t('events.form.budget')} /></SelectTrigger>
              <SelectContent>
                {budgetOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Input name="venueAddress" placeholder={t('events.form.venue')} value={formData.venueAddress} onChange={handleInputChange} />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg mb-2">{t('events.form.notes_title')}</legend>
          <Textarea name="dietaryNotes" placeholder={t('events.form.dietary')} value={formData.dietaryNotes} onChange={handleInputChange} />
          <Textarea name="message" placeholder={t('events.form.message')} value={formData.message} onChange={handleInputChange} />
        </fieldset>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox id="consent" name="consent" checked={formData.consent} onCheckedChange={(c) => handleInputChange({ target: { name: 'consent', type: 'checkbox', checked: c } })} className={errors.consent ? 'border-red-500' : ''} />
          <label htmlFor="consent" className="text-sm text-warm-gray leading-none">{t('events.form.consent')}</label>
        </div>
        <Button type="submit" className="w-full btn-primary !mt-6" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('events.form.submit')}
        </Button>
        <Button type="button" onClick={() => handleNotImplemented('Events Menu PDF Download')} variant="outline" className="w-full btn-secondary !mt-2" size="lg">
          <FileText className="mr-2 h-4 w-4" />
          {t('events.download_menu')}
        </Button>
      </form>
    </motion.div>
  );
};

export default EventForm;