
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollTop } from "@/hooks/use-scroll-top";

const Layout = () => {
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Enable scroll to top on route change
  useScrollTop();
  
  // Close nav when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setNavOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav navOpen={navOpen} setNavOpen={setNavOpen} />
      <main className={`flex-1 pt-28 md:pt-16 ${navOpen && isMobile ? 'pt-[calc(16rem+4rem)]' : ''}`}>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
