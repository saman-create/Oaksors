import { useEffect, useState } from "react";

const TOP_BAR_HEIGHT = 36;

export function useHeaderScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isTopBarHidden: scrollY > TOP_BAR_HEIGHT,
    isHeaderScrolled: scrollY > 20,
    headerTop: Math.max(0, TOP_BAR_HEIGHT - scrollY),
  };
}
