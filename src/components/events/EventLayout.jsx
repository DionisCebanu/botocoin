import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Utensils, Truck, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { appearContainer, appearItem } from '@/lib/animations';
import FlyingDecor from '@/components/decor/FlyingDecor';
import EventForm from '@/components/events/EventForm';
import WaveDivider from '@/components/WaveDivider';

const EventLayout = ({ eventType }) => {
  const { t } = useTranslation();
  const content = t(`events.${eventType}`, { returnObjects: true });
  const [selectedTier, setSelectedTier] = useState(content.tiers[1].value);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleTierSelect = (tierValue) => {
    setSelectedTier(tierValue);
    scrollTo('event-form');
  };

  const logisticsIcons = {
    "Guest Count": <Users className="w-6 h-6 text-amber-orange" />,
    "Delivery & Pickup": <Truck className="w-6 h-6 text-amber-orange" />,
    "Lead Time": <Clock className="w-6 h-6 text-amber-orange" />,
    "Staffing/Setup": <Utensils className="w-6 h-6 text-amber-orange" />,
    "Fundraising": <Users className="w-6 h-6 text-amber-orange" />,
    "Nut-Aware Handling": <Users className="w-6 h-6 text-amber-orange" />,
    "Presentation": <Utensils className="w-6 h-6 text-amber-orange" />,
    "Delivery": <Truck className="w-6 h-6 text-amber-orange" />,
  };

  return (
    <>
      <Helmet>
        <title>{`${content.hero.title} - ${t('events.seo_title')}`}</title>
        <meta name="description" content={content.hero.subtitle} />
      </Helmet>
      <main>
        {/* Hero */}
        <section className="relative bg-chocolate-brown text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <FlyingDecor className="z-0 opacity-10 motion-safe:animate-slow-float" />
          <motion.div
            className="section-container text-center relative z-10"
            variants={appearContainer}
            initial="hidden"
            animate="show"
          >
            <motion.h1 variants={appearItem} className="font-display text-5xl md:text-7xl font-bold text-soft-cream mb-4">{content.hero.title}</motion.h1>
            <motion.p variants={appearItem} className="text-xl md:text-2xl text-soft-cream/80 max-w-3xl mx-auto mb-8">{content.hero.subtitle}</motion.p>
            <motion.div variants={appearItem}>
              <Button onClick={() => scrollTo('event-form')} size="lg" className="btn-primary">{t('events.cta_quote')}</Button>
            </motion.div>
          </motion.div>
          <WaveDivider className="absolute -bottom-px left-0 w-full text-soft-cream dark:text-dark-bg" />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={appearContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            
            {/* Overview */}
            <section className="py-16 md:py-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div variants={appearItem}>
                  <h2 className="section-title mb-6">{t('events.overview_title')}</h2>
                  <div className="prose prose-lg dark:prose-invert">
                    {content.overview.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </motion.div>
                <motion.div variants={appearItem}>
                  <img alt={`${content.hero.title} event setup`} className="rounded-2xl shadow-lg object-cover aspect-square w-full" src="https://ik.imagekit.io/e7yxvoeog/uploads/news/news-2.png?updatedAt=1756406437345" />
                </motion.div>
              </div>
            </section>

            {/* Budget Tiers */}
            <section className="py-16 md:py-24">
              <div className="text-center">
                <motion.h2 variants={appearItem} className="section-title mb-12">{t('events.tiers_title')}</motion.h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {content.tiers.map((tier, i) => (
                    <motion.div 
                      variants={appearItem} 
                      key={i} 
                      className={`bg-white/95 dark:bg-dark-surface/95 p-8 rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 flex flex-col ${tier.highlight ? 'ring-2 ring-amber-400' : ''}`}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex-grow">
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full mb-4">{tier.price}</span>
                        <h3 className="text-3xl font-bold font-display text-chocolate-brown dark:text-soft-cream mb-4">{tier.name}</h3>
                        <ul className="space-y-2 text-left text-warm-gray mb-6">
                          {tier.includes.map((item, j) => (
                            <li key={j} className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-warm-gray/80 italic">{tier.notes}</p>
                      </div>
                      <Button onClick={() => handleTierSelect(tier.value)} className="w-full mt-8 btn-primary">{t('events.select_tier')}</Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Logistics & Service */}
            <section className="py-16 md:py-24">
              <motion.h2 variants={appearItem} className="section-title text-center mb-12">{t('events.logistics_title')}</motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {content.logistics.map((item, i) => (
                  <motion.div variants={appearItem} key={i} className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-soft text-center">
                    <div className="flex justify-center mb-4">{logisticsIcons[item.title] || <Utensils className="w-6 h-6 text-amber-orange" />}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-warm-gray text-sm">{item.details}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-16 py-16 md:py-24">
              <div className="lg:col-span-2">
                {/* Dietary & Allergens */}
                <motion.section variants={appearItem} className="mb-16">
                  <h2 className="section-title mb-6">{t('events.dietary_title')}</h2>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {t('events.dietary_badges', { returnObjects: true }).map(badge => (
                      <span key={badge} className="bg-green-100 text-green-800 text-sm font-medium me-2 px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">{badge}</span>
                    ))}
                  </div>
                  <p className="text-sm text-warm-gray italic">{t('events.dietary_disclaimer')}</p>
                </motion.section>

                {/* FAQ */}
                <motion.section variants={appearItem}>
                  <h2 className="section-title mb-6">{t('events.faq_title')}</h2>
                  <div className="bg-white/90 dark:bg-dark-surface/90 rounded-2xl shadow-soft p-6 md:p-8">
                    <Accordion type="single" collapsible className="w-full">
                      {content.faq.map((item, i) => (
                        <AccordionItem value={`item-${i}`} key={i}>
                          <AccordionTrigger className="text-lg font-semibold text-left">{item.q}</AccordionTrigger>
                          <AccordionContent className="text-base text-warm-gray">{item.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.section>
              </div>

              {/* Form */}
              <div className="lg:sticky top-24 h-min">
                <EventForm eventType={eventType} selectedTier={selectedTier} onTierChange={setSelectedTier} />
              </div>
            </div>

            {/* Visit Us */}
            <section className="py-16 md:py-24">
              <motion.div variants={appearItem} className="max-w-2xl mx-auto text-center bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-bold mb-4">{t('events.visit_us_title')}</h3>
                <p className="text-warm-gray mb-4">{t('events.visit_us_desc')}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild variant="outline">
                    <a href="https://www.openstreetmap.org/?mlat=45.5492&mlon=-73.5729#map=17/45.5492/-73.5729" target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-2 h-4 w-4" /> {t('about_address')}
                    </a>
                  </Button>
                  <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">QR Code</div>
                </div>
              </motion.div>
            </section>
          </motion.div>
        </div>
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-4 border-t border-chocolate-brown/10 dark:border-warm-gray/20 z-40" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
          <Button onClick={() => scrollTo('event-form')} className="w-full btn-primary">{t('events.cta_quote')}</Button>
        </div>
      </main>
    </>
  );
};

export default EventLayout;