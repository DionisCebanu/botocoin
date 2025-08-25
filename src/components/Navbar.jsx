
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Instagram, Phone, Menu as MenuIcon, X } from 'lucide-react';
import NavWave from './ui/NavWave';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Logo = () => (
  <a href="/" className="relative flex items-center justify-center group" aria-label="Le Botocoin Home">
    {/* Circle background */}
    <div className="w-20 h-20 bg-[rgb(249,175,7)] dark:bg-dark-surface rounded-full shadow-md transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
      {/* Ensure the image stays inside the circle */}
      <img src="/img/logo/logo.png" alt="Le Botocoin Logo" className="w-12 h-12 object-contain" />
    </div>
  </a>
);



const Navbar = ({ onSocialClick, onCallClick, onOrderClick }) => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  const handleScroll = () => {
    setScrolled(window.scrollY > 40);
    
    const sections = ['bestsellers', 'donuts', 'quality', 'news', 'gallery', 'contact'];
    let currentSection = '';
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section && section.getBoundingClientRect().top < window.innerHeight / 2) {
        currentSection = `#${sectionId}`;
      }
    }
    setActiveLink(currentSection);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav_menu'), href: '#bestsellers' },
    { name: t('nav_quality'), href: '#quality' },
    { name: t('nav_news'), href: '#news' },
    { name: t('nav_gallery'), href: '#gallery' },
    { name: t('nav_contact'), href: '#contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-soft-cream/90 dark:bg-dark-bg/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-24">
            <a href="#" className="font-logo text-3xl font-bold text-chocolate-brown dark:text-soft-cream md:hidden">
              Le Botocoin
            </a>
            <nav className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center gap-8">
                {navLinks.slice(0, 2).map((link) => (
                  <a key={link.href} href={link.href} className={`font-semibold text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange dark:hover:text-amber-orange transition-colors relative group ${activeLink === link.href ? 'text-amber-orange' : ''}`}>
                    {link.name}
                    <span className={`absolute bottom-[-6px] left-0 w-full h-0.5 bg-amber-orange transition-transform duration-300 scale-x-0 group-hover:scale-x-100 ${activeLink === link.href ? 'scale-x-100' : ''}`} />
                  </a>
                ))}
              </div>
              <div className="px-8 pt-4">
                <Logo />
              </div>
              <div className="flex items-center gap-8">
                {navLinks.slice(2).map((link) => (
                    <a key={link.href} href={link.href} className={`font-semibold text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange dark:hover:text-amber-orange transition-colors relative group ${activeLink === link.href ? 'text-amber-orange' : ''}`}>
                    {link.name}
                    <span className={`absolute bottom-[-6px] left-0 w-full h-0.5 bg-amber-orange transition-transform duration-300 scale-x-0 group-hover:scale-x-100 ${activeLink === link.href ? 'scale-x-100' : ''}`} />
                  </a>
                ))}
              </div>
            </nav>
            <div className="hidden md:flex items-center space-x-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button onClick={() => onSocialClick('Instagram')} className="p-2 text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange dark:hover:text-amber-orange transition-colors">
                <Instagram size={22} />
              </button>
              <button onClick={onCallClick} className="p-2 text-chocolate-brown dark:text-soft-cream/90 hover:text-amber-orange dark:hover:text-amber-orange transition-colors">
                <Phone size={22} />
              </button>
              <button onClick={onOrderClick} className="btn-primary ml-2 !px-6 !py-2.5">{t('nav_order')}</button>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button onClick={() => setIsOpen(!isOpen)} className="text-chocolate-brown dark:text-soft-cream z-50 relative" aria-label="Open menu">
                {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>
          </div>
        </div>
         {/* Wave */}
         {scrolled && (
            <NavWave className="pointer-events-none absolute mb-6 left-0 w-full h-6 md:h-10 text-soft-cream dark:text-dark-bg opacity-90 z-10" />
          )}

      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-soft-cream dark:bg-dark-bg p-8 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full pt-20">
                <nav className="flex flex-col items-center justify-center flex-grow space-y-8">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.07 + 0.2 }}
                      className="font-display text-chocolate-brown dark:text-soft-cream text-4xl"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  <motion.button 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => { onOrderClick(); setIsOpen(false); }} className="btn-primary mt-8">{t('nav_order')}</motion.button>
                </nav>
                <div className="flex items-center justify-center space-x-6 pt-8">
                  <button onClick={() => onSocialClick('Instagram')} className="text-chocolate-brown dark:text-soft-cream hover:text-amber-orange transition-colors"><Instagram size={32} /></button>
                  <button onClick={onCallClick} className="text-chocolate-brown dark:text-soft-cream hover:text-amber-orange transition-colors"><Phone size={32} /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
         
      </AnimatePresence>
    </>
  );
};

export default Navbar;
