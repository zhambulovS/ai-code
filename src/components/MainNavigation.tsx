
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

export default function MainNavigation() {
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/problems", label: t('nav.problems') },
    { path: "/courses", label: t('nav.courses') },
    { path: "/leaderboard", label: t('nav.leaderboard') },
  ];

  return (
    <header className="bg-background backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link to="/" className="font-bold text-xl flex items-center">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">CodeCrafters</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            onClick={toggleMenu}
            className="h-9 w-9"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Auth Buttons and Language Selector (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          
          {!loading && user ? (
            <>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Settings">
                  <Settings className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  {t('nav.profile')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  {t('nav.register')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <div className="container px-4 py-3 flex flex-col">
            <nav className="flex flex-col space-y-3 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors px-2 py-1.5 hover:text-primary ${
                    location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2">
              <div className="flex justify-center mb-2">
                <LanguageSelector />
              </div>
              
              {!loading && user ? (
                <>
                  <Link to="/settings" className="w-full">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t('settings.title')}
                    </Button>
                  </Link>
                  <Link to="/profile" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      {t('nav.profile')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="w-full">
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button variant="default" size="sm" className="w-full">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
