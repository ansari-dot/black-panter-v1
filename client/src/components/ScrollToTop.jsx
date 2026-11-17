import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const portalRoutes = ['/settings', '/orders', '/track', '/wishlist', '/quotations', '/quotes'];

export function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const isPrevPortal = portalRoutes.some(route => prevPathname.current.startsWith(route));
    const isCurrentPortal = portalRoutes.some(route => pathname.startsWith(route));

    // Do NOT jump scroll if user is switching between user portal sidebar tabs
    if (!(isPrevPortal && isCurrentPortal)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}

export default ScrollToTop;
