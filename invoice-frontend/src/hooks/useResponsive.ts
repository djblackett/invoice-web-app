import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [editPageWidth, setEditPageWidth] = useState(0);
  const [padding, setPadding] = useState('');

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 600);
      if (width > 1200) {
        setEditPageWidth(616);
        setPadding('2.5rem 2.5rem 2rem calc(2.5rem + 17px)');
      } else if (width < 1200 && width > 325) {
        setEditPageWidth(616);
        setPadding('2.5rem');
      } else if (width < 325) {
        setEditPageWidth(325);
        setPadding('2rem 1.5rem 2.5rem');
      } else if (width < 600) {
        setEditPageWidth(width);
        setPadding('1.5rem');
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Initial call
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { isMobile, editPageWidth, padding };
};
