import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scroll to the absolute top-left of the page
    window.scrollTo(0, 0);
  }, [pathname]); // This effect runs every single time the URL pathway changes

  return null; // This component renders nothing to the screen
}