import { getHomeSlides } from "@/lib/queries";
import HeroCarouselView from "./HeroCarouselView";

export default async function HeroCarousel() {
  const { enabled, intervalSec, slides } = await getHomeSlides();
  const live = slides.filter((s) => s.active !== false);
  if (!enabled || live.length === 0) return null;
  return <HeroCarouselView slides={live} intervalSec={intervalSec} />;
}
