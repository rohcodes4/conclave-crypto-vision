
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollTop } from "@/hooks/use-scroll-top";

const LayoutNew = () => {
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
      <main className={`flex-1 pt-32 md:pt-20 ${navOpen && isMobile ? 'pt-[calc(16rem+4rem)]' : ''}`}>
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default LayoutNew;
