
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Globe } from "lucide-react";

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
    
    // Show a toast notification when language changes
    toast({
      title: newLanguage === 'en' ? 'Language changed to English' : 'Тіл қазақшаға өзгертілді',
      duration: 2000
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center justify-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLanguage === 'en' ? 'EN' : 'KK'}</span>
    </Button>
  );
};
