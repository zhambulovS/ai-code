
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Github, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-gradient">CodeOlympiad</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              Helping students prepare for informatics olympiads through structured learning and practice.
            </p>
            <div className="mt-6 flex space-x-4">
              <motion.a 
                href="#" 
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-indigo-400 mb-4">Resources</h3>
            <ul className="space-y-3">
              {["Problem Catalog", "Tutorials", "Learning Path"].map((item, index) => (
                <li key={index}>
                  <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors nav-link inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-indigo-400 mb-4">Community</h3>
            <ul className="space-y-3">
              {["Leaderboard", "Discussion Forum", "Upcoming Events"].map((item, index) => (
                <li key={index}>
                  <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors nav-link inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-indigo-400 mb-4">Support</h3>
            <ul className="space-y-3">
              {["Get Help", "FAQ", "Contact Us"].map((item, index) => (
                <li key={index}>
                  <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors nav-link inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CodeOlympiad. All rights reserved.
          </p>
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-900/50 hover:bg-indigo-800 transition-colors"
          >
            <ArrowUp className="h-4 w-4 text-white" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
