import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, School, PartyPopper, Briefcase, Quote } from 'lucide-react';
import { appearContainer, appearItem } from '@/lib/animations';
import FlyingDecor from '@/components/decor/FlyingDecor';
import WaveDivider from '@/components/WaveDivider';
import CtaBanner from '@/components/CtaBanner';

const EventsMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const eventTypes = [
    { key: 'school', icon: <School className="w-8 h-8" />, path: '/events/school' },
    { key: 'party', icon: <PartyPopper className="w-8 h-8" />, path: '/events/party' },
    { key: 'corporate', icon: <Briefcase className="w-8 h-8" />, path: '/events/corporate' },
  ];

  const howItWorksSteps = t('events.menu_how_it_works_steps', { returnObjects: true });

  return (
    <>
      <Helmet>
        <title>{t('events.menu_title')} - Le Botocoin</title>
        <meta name="description" content={t('events.menu_subtitle')} />
      </Helmet>
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-soft-cream to-amber-50 dark:from-dark-bg dark:to-dark-surface pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute -z-10 blur-3xl opacity-20 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-300 to-rose-300 top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
            <FlyingDecor className="opacity-10 motion-safe:animate-slow-float" />
          </div>
          <motion.div
            className="section-container text-center relative z-10"
            variants={appearContainer}
            initial="hidden"
            animate="show"
          >
            <motion.h1 variants={appearItem} className="font-display text-5xl md:text-7xl font-bold text-chocolate-brown dark:text-soft-cream mb-4">{t('events.menu_title')}</motion.h1>
            <motion.p variants={appearItem} className="text-xl md:text-2xl text-warm-gray max-w-3xl mx-auto mb-8">{t('events.menu_subtitle')}</motion.p>
            <motion.div
              variants={appearItem}
              className="flex flex-wrap gap-4 items-center justify-center bg-white/10 dark:bg-dark-bg/30 backdrop-blur-lg rounded-2xl px-6 py-6 shadow-xl ring-1 ring-amber-300/30"
            >
              <Button
                onClick={() => scrollTo('event-types')}
                size="lg"
                className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-br from-amber-orange via-amber-400 to-amber-orange shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 focus-visible:ring-4 focus-visible:ring-amber-orange/70 active:scale-95"
              >
                <PartyPopper className="w-5 h-5" />
                {t('events.menu_cta_choose')}
              </Button>
              <Button
                onClick={() => scrollTo('footer-cta')}
                size="lg"
                variant="outline"
                className="px-8 py-4 rounded-full font-bold text-amber-orange bg-white/60 dark:bg-dark-surface/60 border-2 border-amber-orange/40 shadow-md hover:shadow-2xl hover:scale-105 hover:bg-amber-50/80 dark:hover:bg-amber-900/10 transition-all duration-300 flex items-center gap-3 focus-visible:ring-4 focus-visible:ring-amber-orange/70 active:scale-95"
              >
                <Quote className="w-5 h-5" />
                {t('events.menu_cta_quote')}
              </Button>
            </motion.div>
          </motion.div>
          <WaveDivider className="absolute -bottom-px left-0 w-full text-soft-cream dark:text-dark-bg" />
        </section>

        {/* Event Type Selector */}
        <motion.section
          id="event-types"
          className="py-16 md:py-24"
          variants={appearContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {eventTypes.map((event) => (
                <motion.div
                  key={event.key}
                  variants={appearItem}
                  whileHover={{ y: -8, boxShadow: 'var(--tw-shadow-md)' }}
                  className="bg-white/95 dark:bg-dark-surface/95 rounded-2xl p-8 text-left shadow-soft cursor-pointer transition-all ring-1 ring-transparent hover:ring-amber-400/40"
                  onClick={() => navigate(event.path)}
                >
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full inline-block mb-4 text-amber-600 dark:text-amber-300">
                    {event.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-2">{t(`events.menu_cards.${event.key}.title`)}</h3>
                  <p className="text-warm-gray mb-4">{t(`events.menu_cards.${event.key}.desc`)}</p>
                  <span className="font-semibold text-amber-orange flex items-center gap-2">
                    Explore <ArrowRight size={16} />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="py-16 md:py-24 bg-white dark:bg-dark-surface"
          variants={appearContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 variants={appearItem} className="section-title mb-12">{t('events.menu_how_it_works_title')}</motion.h2>
            <div className="grid md:grid-cols-3 gap-8 items-start relative">
              <div className="hidden md:block absolute top-6 left-0 w-full h-[3px] bg-amber-200 dark:bg-amber-800/50" />
              {howItWorksSteps.map((step, i) => (
                <motion.div key={i} variants={appearItem} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded-full flex items-center justify-center font-bold text-xl mb-4 ring-8 ring-white dark:ring-dark-surface">{i + 1}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-warm-gray">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer CTA */}
       
        <CtaBanner 
            title={t('events.footer_banner_title')}
            subtitle={t('events.footer_banner_desc')}
            buttonText={t('events.cta_quote')}
            onButtonClick={() => navigate('/#contact')}
        />
      </main>
    </>
  );
};

export default EventsMenu;