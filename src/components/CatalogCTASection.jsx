import React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles } from 'lucide-react';

const CatalogCTASection = ({ onCatalogClick }) => {
  return (
    <SectionWrapper id="catalog-teaser" className="bg-cream">
      <div
        className="text-center bg-chocolate-brown text-white p-10 md:p-16 rounded-3xl shadow-2xl"
      >
        <Sparkles className="h-12 w-12 mx-auto text-light-coral mb-4"/>
        <h2 className="font-display text-4xl font-bold mb-4">
          Un catalogue complet arrive bientôt !
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-white/80">
          Nous préparons une page complète pour vous permettre d'explorer tous nos produits. Un peu de patience, la gourmandise arrive !
        </p>
        <Button
          onClick={onCatalogClick}
          className="btn-secondary"
        >
          <BookOpen className="mr-3 h-5 w-5" />
          Découvrir (bientôt)
        </Button>
      </div>
    </SectionWrapper>
  );
};

export default CatalogCTASection;