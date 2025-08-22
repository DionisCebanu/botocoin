import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, MapPin, Clock, Phone, ArrowRight, Mail } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { itemVariants } from '@/lib/animations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapCard from '@/components/MapCard';

/* ------------ Inputs with floating labels ------------ */

const FloatingLabelInput = ({ id, label, name, className = '', ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.defaultValue);

  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name || id}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value !== ''); }}
        placeholder={label}
        className="
          w-full rounded-xl bg-soft-cream/60 dark:bg-dark-bg/70
          ring-1 ring-black/5 dark:ring-white/5
          p-4 pt-6 placeholder:text-transparent
          focus:outline-none focus:ring-2 focus:ring-amber-orange
          transition-shadow
        "
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isFloating ? 'top-2 text-xs text-amber-orange' : 'top-4 text-base text-warm-gray'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

const FloatingLabelTextarea = ({ id, label, name, className = '', ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.defaultValue);

  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <textarea
        id={id}
        name={name || id}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value !== ''); }}
        placeholder={label}
        className="
          w-full min-h-[150px] rounded-xl bg-soft-cream/60 dark:bg-dark-bg/70
          ring-1 ring-black/5 dark:ring-white/5
          p-4 pt-6 placeholder:text-transparent
          focus:outline-none focus:ring-2 focus:ring-amber-orange
          transition-shadow
        "
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isFloating ? 'top-2 text-xs text-amber-orange' : 'top-4 text-base text-warm-gray'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

/* -------------------- Section -------------------- */

const ContactSection = ({ onFormSubmit }) => {
  const { t } = useTranslation();

  return (
    <AnimatedSection as="section" id="contact" className="section-wrapper bg-soft-cream dark:bg-dark-bg">
      <div className="section-container">
        <div className="text-center mb-14">
          <motion.h2 variants={itemVariants} className="section-title">{t('contact_title')}</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle mx-auto mt-3 max-w-2xl">
            {t('contact_subtitle')}
          </motion.p>
        </div>

        {/* NEW GRID: 12 cols, 2 rows (map spans row 2) */}
        <div className="grid xl:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left: info card */}
          <motion.aside variants={itemVariants} className="xl:col-span-4 self-stretch">
            <div className="h-full flex flex-col justify-around rounded-2xl bg-white/70 dark:bg-dark-surface/70 backdrop-blur ring-1 ring-black/5 dark:ring-white/5 p-6 md:p-7 shadow-sm">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-chocolate-brown dark:text-soft-cream mb-6">
                {t('contact_visit_us')}
              </h3>

              <ul className="space-y-5 text-lg flex flex-col justify-around">
                <li className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-orange/15 text-amber-orange flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-chocolate-brown dark:text-soft-cream">{t('contact_address_label')}</p>
                    <p className="text-warm-gray">{t('contact_address_value')}</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-orange/15 text-amber-orange flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-chocolate-brown dark:text-soft-cream">{t('contact_hours_label')}</p>
                    <p className="text-warm-gray">{t('contact_hours_value_1')}</p>
                    <p className="text-warm-gray">{t('contact_hours_value_2')}</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-orange/15 text-amber-orange flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-chocolate-brown dark:text-soft-cream">{t('contact_phone_label')}</p>
                    <a href={`tel:${t('contact_phone_value')}`} className="text-warm-gray hover:text-amber-orange transition-colors">
                      {t('contact_phone_value')}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-orange/15 text-amber-orange flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-chocolate-brown dark:text-soft-cream">{t('contact_email_label')}</p>
                    <a href={`mailto:${t('contact_email_value')}`} className="text-warm-gray hover:text-amber-orange transition-colors">
                      {t('contact_email_value')}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </motion.aside>

          {/* Right: form (slightly more compact) */}
          <motion.form
            variants={itemVariants}
            onSubmit={onFormSubmit}
            className="xl:col-span-8 rounded-2xl bg-white/80 dark:bg-dark-surface/80 backdrop-blur
                       ring-1 ring-black/5 dark:ring-white/5 p-6 md:p-8 lg:p-10 shadow-md space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FloatingLabelInput id="name" label={t('form_name_label')} type="text" required />
              <FloatingLabelInput id="email" label={t('form_email_label')} type="email" required />
            </div>

            <FloatingLabelInput id="phone" label={t('form_phone_label')} type="tel" />

            <div>
              <Select>
                {/* reduced height for a tighter form */}
                <SelectTrigger className="w-full h-14 rounded-xl bg-soft-cream/60 dark:bg-dark-bg/70 ring-1 ring-black/5 dark:ring-white/5 text-warm-gray">
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

            {/* slightly shorter textarea */}
            <FloatingLabelTextarea id="message" label={t('form_message_label')} required className="min-h-[120px]" />

            <div className="flex justify-end">
              <button type="submit" className="btn-primary inline-flex items-center">
                <Send className="mr-2 h-5 w-5" />
                {t('form_submit_button')}
              </button>
            </div>
          </motion.form>

          {/* Row 2: map spans full width */}
          <motion.div variants={itemVariants} className="xl:col-span-12">
            <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-soft ring-1 ring-black/5 dark:ring-white/5 bg-white/70 dark:bg-dark-surface/70 backdrop-blur">
              <MapCard />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};


export default ContactSection;
