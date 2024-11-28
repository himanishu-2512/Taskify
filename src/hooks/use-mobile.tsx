import { useEffect, useState } from 'react';

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    // Initial check
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Listen for changes in the media query match
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up the event listener
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  return isMobile;
};

export { useIsMobile};
