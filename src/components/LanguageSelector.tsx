
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Flag } from "lucide-react";

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
      className="w-16 flex items-center justify-center gap-1"
    >
      <Flag className="h-4 w-4" />
      {currentLanguage === 'en' ? 'EN' : 'KK'}
    </Button>
  );
};
