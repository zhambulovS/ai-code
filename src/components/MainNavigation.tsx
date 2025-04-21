
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/use-mobile";

export default function MainNavigation() {
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link to="/" className="font-bold text-xl flex items-center">
            CodeMaster
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

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {!loading && user ? (
            <>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  My Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden border-t border-border">
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
              {!loading && user ? (
                <>
                  <Link to="/profile" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      My Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={signOut} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button variant="default" size="sm" className="w-full">
                      Register
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
