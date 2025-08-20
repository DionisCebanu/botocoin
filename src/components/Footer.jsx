
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = ({ onSocialClick }) => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-chocolate-brown text-soft-cream/80">
      <div className="section-container py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <span className="font-logo text-4xl text-white">Le Botocoin</span>
            <p>
              {t('footer_about')}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{t('footer_nav_title')}</h3>
            <div className="flex flex-col space-y-2">
              <a href="#donuts" className="hover:text-amber-orange transition-colors">{t('donuts_title')}</a>
              <a href="#quality" className="hover:text-amber-orange transition-colors">{t('quality_title')}</a>
              <a href="#gallery" className="hover:text-amber-orange transition-colors">{t('gallery_title')}</a>
              <a href="#contact" className="hover:text-amber-orange transition-colors">{t('contact_title')}</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{t('footer_follow_us')}</h3>
            <div className="flex justify-center md:justify-start space-x-5">
              <button onClick={() => onSocialClick('Instagram')} className="hover:text-amber-orange transition-colors"><Instagram size={24} /></button>
              <button onClick={() => onSocialClick('Facebook')} className="hover:text-amber-orange transition-colors"><Facebook size={24} /></button>
              <button onClick={() => onSocialClick('Email')} className="hover:text-amber-orange transition-colors"><Mail size={24} /></button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-soft-cream/20 mt-10 pt-8 text-center text-sm">
          <p>{t('footer_copyright', { year })}</p>
          <p className="mt-1">
            {t('footer_credit')}{' '}
            <a 
              href="https://dioniscode.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-amber-orange hover:underline"
            >
              Webcraft by Dionis
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
