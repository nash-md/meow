import { useState, useEffect } from 'react';

interface CustomWindow extends Window {
  innerWidth: number;
}

declare let window: CustomWindow;

const useMobileLayout = (): boolean => {
  const [isMobileLayout, setIsMobileLayout] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const checkLayout = () => {
      setIsMobileLayout(window.innerWidth <= 600);
    };

    window.addEventListener('resize', checkLayout);

    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  return isMobileLayout;
};

export default useMobileLayout;
