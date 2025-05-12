
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainNavigation() {
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/problems", label: "Problems" },
    { path: "/courses", label: "Courses" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2 z-20">
          <Code className={`h-8 w-8 ${isScrolled ? 'text-indigo-400' : 'text-white'}`} />
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}
          >
            CodeOlympiad
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Link
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-400 nav-link ${
                  location.pathname === item.path 
                    ? (isScrolled ? 'text-indigo-400' : 'text-indigo-300') 
                    : (isScrolled ? 'text-slate-200' : 'text-white/80')
                }`}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-20">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            onClick={toggleMenu}
            className={`h-9 w-9 ${isScrolled ? 'text-white' : 'text-white'}`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {!loading && user ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/profile">
                  <Button variant="outline" size="sm" className={`rounded-full border-indigo-500 ${isScrolled ? 'text-white hover:bg-indigo-500/20' : 'text-white hover:bg-white/10'}`}>
                    My Profile
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className={`rounded-full ${isScrolled ? 'text-white hover:bg-slate-800' : 'text-white hover:bg-white/10'}`}
                >
                  Logout
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`rounded-full ${isScrolled ? 'text-white hover:bg-slate-800' : 'text-white hover:bg-white/10'}`}
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full"
                  >
                    Register
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-10 flex flex-col"
          >
            <div className="container px-4 py-20 flex flex-col h-full">
              <nav className="flex flex-col space-y-6 py-8 text-center">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-2xl font-medium transition-colors px-2 py-2 hover:text-indigo-400 ${
                      location.pathname === item.path ? 'text-indigo-400' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t border-slate-800 pt-6 pb-12 flex flex-col gap-4">
                {!loading && user ? (
                  <>
                    <Link to="/profile" className="w-full">
                      <Button variant="outline" size="lg" className="w-full rounded-full border-indigo-500 text-white hover:bg-indigo-500/20">
                        My Profile
                      </Button>
                    </Link>
                    <Button variant="ghost" size="lg" onClick={logout} className="w-full rounded-full text-white hover:bg-slate-800">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="ghost" size="lg" className="w-full rounded-full text-white hover:bg-slate-800">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
