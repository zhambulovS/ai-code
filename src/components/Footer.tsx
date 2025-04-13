
import { Link } from "react-router-dom";
import { Code, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-gray-900">CodeOlympiad</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Helping students prepare for informatics olympiads through structured learning and practice.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/problems" className="text-sm text-gray-600 hover:text-primary">
                  Problem Catalog
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-sm text-gray-600 hover:text-primary">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/learning-path" className="text-sm text-gray-600 hover:text-primary">
                  Learning Path
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Community</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/leaderboard" className="text-sm text-gray-600 hover:text-primary">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/discussions" className="text-sm text-gray-600 hover:text-primary">
                  Discussion Forum
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-gray-600 hover:text-primary">
                  Upcoming Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} CodeOlympiad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
