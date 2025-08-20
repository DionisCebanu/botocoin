
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, MapPin, Clock, Phone } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { itemVariants } from '@/lib/animations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MapCard from '@/components/MapCard';

const FloatingLabelInput = ({ id, label, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value !== '');
    };

    const isFloating = isFocused || hasValue;

    return (
        <div className="relative">
            <input 
                id={id}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full p-4 pt-6 rounded-xl bg-soft-cream/50 dark:bg-dark-bg placeholder:text-transparent focus:ring-2 focus:ring-amber-orange outline-none transition-shadow peer"
                placeholder={label}
                {...props}
            />
            <label 
                htmlFor={id} 
                className={`absolute left-4 transition-all duration-300 pointer-events-none text-warm-gray
                    ${isFloating ? 'top-2 text-xs text-amber-orange' : 'top-4 text-base'}`}
            >
                {label}
            </label>
        </div>
    );
};

const FloatingLabelTextarea = ({ id, label, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value !== '');
    };

    const isFloating = isFocused || hasValue;

    return (
        <div className="relative">
            <textarea 
                id={id}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full p-4 pt-6 rounded-xl bg-soft-cream/50 dark:bg-dark-bg placeholder:text-transparent focus:ring-2 focus:ring-amber-orange outline-none transition-shadow peer min-h-[140px]"
                placeholder={label}
                {...props}
            />
            <label 
                htmlFor={id} 
                className={`absolute left-4 transition-all duration-300 pointer-events-none text-warm-gray
                    ${isFloating ? 'top-2 text-xs text-amber-orange' : 'top-4 text-base'}`}
            >
                {label}
            </label>
        </div>
    );
};

const ContactSection = ({ onFormSubmit }) => {
  const { t } = useTranslation();

  return (
    <AnimatedSection as="section" id="contact" className="section-wrapper bg-soft-cream dark:bg-dark-bg">
      <div className="section-container">
        <div className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="section-title">{t('contact_title')}</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-4">
            {t('contact_subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
            <motion.div variants={itemVariants} className="lg:col-span-2">
                 <h3 className="font-display text-3xl font-bold text-chocolate-brown dark:text-soft-cream mb-8">{t('contact_visit_us')}</h3>
                 <div className="space-y-6 text-lg">
                    <div className="flex items-start space-x-4">
                        <MapPin className="h-8 w-8 text-amber-orange mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-chocolate-brown dark:text-soft-cream">{t('contact_address_label')}</h4>
                            <p className="text-warm-gray">{t('contact_address_value')}</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <Clock className="h-8 w-8 text-amber-orange mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-chocolate-brown dark:text-soft-cream">{t('contact_hours_label')}</h4>
                            <p className="text-warm-gray">{t('contact_hours_value_1')}</p>
                            <p className="text-warm-gray">{t('contact_hours_value_2')}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <Phone className="h-8 w-8 text-amber-orange mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-chocolate-brown dark:text-soft-cream">{t('contact_phone_label')}</h4>
                            <p className="text-warm-gray">{t('contact_phone_value')}</p>
                        </div>
                    </div>
                </div>
                 <div className="h-64 md:h-96 mt-10 w-full rounded-2xl overflow-hidden shadow-soft">
                     <MapCard />
                </div>
            </motion.div>
            
            <motion.form
                variants={itemVariants}
                onSubmit={onFormSubmit}
                className="lg:col-span-3 bg-white dark:bg-dark-surface p-8 md:p-10 rounded-2xl shadow-lg space-y-6"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <FloatingLabelInput id="name" label={t('form_name_label')} type="text" required />
                    <FloatingLabelInput id="email" label={t('form_email_label')} type="email" required />
                </div>
                <div>
                     <FloatingLabelInput id="phone" label={t('form_phone_label')} type="tel" />
                </div>
                <div>
                    <Select>
                        <SelectTrigger className="w-full text-warm-gray h-16 rounded-xl bg-soft-cream/50 dark:bg-dark-bg">
                            <SelectValue placeholder={t('form_topic_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="order">{t('form_topic_order')}</SelectItem>
                            <SelectItem value="catering">{t('form_topic_catering')}</SelectItem>
                            <SelectItem value="feedback">{t('form_topic_feedback')}</SelectItem>
                            <SelectItem value="other">{t('form_topic_other')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <FloatingLabelTextarea id="message" label={t('form_message_label')} required />
                <div className="text-right pt-2">
                    <button type="submit" className="btn-primary">
                        <Send className="mr-2 h-5 w-5" />
                        {t('form_submit_button')}
                    </button>
                </div>
            </motion.form>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;
