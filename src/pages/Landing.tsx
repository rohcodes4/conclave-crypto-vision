import Component from "@/components/ui/saa-s-template";
import { Hero } from "@/components/landing/Hero";
import React from "react";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TokenExploration } from "@/components/landing/TOkenExploration";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { WhyPaperTrader } from "@/components/landing/WhyPaperTrader";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import FeaturesSection from "@/components/ui/bento-features";
import { Features } from "@/components/ui/features.6";
import RugCheckerSection from "@/components/landing/RugCheckerSection";


export const LandingPage: React.FC = () => {
  return (
    <div className="bg-neutral-950 text-neutral-100 overflow-hidden">
        <Component />
        {/* <FeaturesGrid /> */}
        <FeaturesSection />
        <Features/>
      <TokenExploration />
      {/* <PortfolioSection /> */}
      <RugCheckerSection />
      {/* <WhyPaperTrader /> */}
      {/* <FinalCTA /> */}
      {/* <Footer /> */}
      {/* <Hero /> */}
      {/* <FeaturesGrid />
      <TokenExploration />
      <PortfolioSection />
      <RugCheckerSection />
      <WhyPaperTrader />
      <FinalCTA />
      <Footer /> */}
    </div>
  );
};

export default LandingPage;
