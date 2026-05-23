import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Handles scroll behavior across route changes:
 * - If URL has a hash, smooth-scroll to that element after layout.
 * - Otherwise, jump to top.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
