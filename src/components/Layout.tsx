
import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const { i18n } = useTranslation();
  
  // Set the document's lang attribute whenever the language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
    
    // Add a class to body for language-specific styling if needed
    document.body.classList.remove('lang-en', 'lang-kk');
    document.body.classList.add(`lang-${i18n.language}`);
  }, [i18n.language]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MainNavigation />
      <main className="flex-grow animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
