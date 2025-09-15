// hooks/useHashScroll.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      // smooth scroll when the element is ready
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }, [hash]);
}
