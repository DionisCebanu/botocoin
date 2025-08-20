
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Languages } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-chocolate-brown dark:text-soft-cream/90 hover:bg-amber-orange/10 dark:hover:bg-amber-orange/10">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 bg-soft-cream dark:bg-dark-surface border-chocolate-brown/10 dark:border-warm-gray/30">
        <div className="grid gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                "w-full text-left flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-amber-orange/10",
                i18n.language === lang.code ? "bg-amber-orange/20" : "opacity-80"
              )}
            >
              {lang.name}
              {i18n.language === lang.code && <Check className="ml-auto h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
