
import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <MainNavigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
