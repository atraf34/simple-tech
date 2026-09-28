import HeroBanner from "@/components/home/HeroBanner";
import FilterChips from "@/components/home/FilterChips";
import CategoryGrid from "@/components/home/CategoryGrid";
import FlashDeals from "@/components/home/FlashDeals";
import ProjectKits from "@/components/home/ProjectKits";
import TrustBadges from "@/components/home/TrustBadges";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FilterChips />
      <CategoryGrid />
      <FlashDeals />
      <ProjectKits />
      <TrustBadges />
    </>
  );
}
