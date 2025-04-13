
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Code, 
  BarChart, 
  User, 
  LogIn, 
  LogOut,
  Menu, 
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-gray-900">CodeOlympiad</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/problems" className="text-gray-700 hover:text-primary flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                <span>Problems</span>
              </Link>
              <Link to="/leaderboard" className="text-gray-700 hover:text-primary flex items-center">
                <BarChart className="mr-1 h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary">
                    <User className="mr-1 h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="text-gray-700">
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="text-gray-700">
                    <LogIn className="mr-1 h-4 w-4" />
                    <span>Log in</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-2 animate-fade-in">
            <Link 
              to="/problems" 
              className="block px-3 py-2 text-gray-700 hover:bg-primary/10 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Problems</span>
              </div>
            </Link>
            <Link 
              to="/leaderboard" 
              className="block px-3 py-2 text-gray-700 hover:bg-primary/10 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                <span>Leaderboard</span>
              </div>
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-gray-700 hover:bg-primary/10 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-primary/10 rounded-md"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-gray-700 hover:bg-primary/10 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log in</span>
                  </div>
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 text-gray-700 hover:bg-primary/10 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Sign up</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
