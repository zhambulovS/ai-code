
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'kk' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="w-20 flex items-center justify-center gap-2"
    >
      {currentLanguage === 'en' ? (
        <>
          <span className="h-4 w-6">🇬🇧</span>
          <span>EN</span>
        </>
      ) : (
        <>
          <span className="h-4 w-6">🇰🇿</span>
          <span>KK</span>
        </>
      )}
    </Button>
  );
};
