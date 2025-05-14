
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
          <svg className="h-4 w-6" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <rect width="640" height="480" fill="#012169"/>
            <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" fill="#FFF"/>
            <path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E"/>
            <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#FFF"/>
            <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#C8102E"/>
          </svg>
          <span>EN</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-6" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <rect width="640" height="480" fill="#00AFCA"/>
            <circle cx="320" cy="240" r="120" fill="#FFCD00"/>
            <g transform="translate(320 240) scale(70)">
              <g id="eagle">
                <path d="M0,-1 L0.05,0.05 L0.5,0 L0.05,-0.05 Z" fill="#000"/>
                <path d="M-0.5,0 L-0.05,-0.05 L0,-1 L-0.05,0.05 Z" fill="#000"/>
                <path d="M-0.05,0.05 L0,0.5 L0.05,0.05 Z" fill="#000"/>
              </g>
            </g>
            <g transform="translate(262 240)">
              <path d="M0,0 L10,-30 L20,0 L10,30 Z" fill="#FFCD00"/>
              <path d="M0,0 L10,-30 L20,0 Z" fill="#000"/>
            </g>
            <g transform="translate(378 240)">
              <path d="M0,0 L-10,-30 L-20,0 L-10,30 Z" fill="#FFCD00"/>
              <path d="M0,0 L-10,-30 L-20,0 Z" fill="#000"/>
            </g>
          </svg>
          <span>KK</span>
        </>
      )}
    </Button>
  );
};
