
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
