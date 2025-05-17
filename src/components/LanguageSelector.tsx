
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (language: string) => {
    if (language === currentLanguage) return;
    
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    setCurrentLanguage(language);
    
    // Show a toast notification when language changes
    toast({
      title: language === 'en' ? t('language.switchedToEnglish') : t('language.switchedToKazakh'),
      duration: 2000
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-2 h-9 w-[4rem]"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'EN' : 'KK'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[8rem]">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLanguage === 'en' ? "bg-accent text-accent-foreground" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('kk')}
          className={currentLanguage === 'kk' ? "bg-accent text-accent-foreground" : ""}
        >
          Қазақша
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
