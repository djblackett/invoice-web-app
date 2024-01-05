import {useState, useEffect, useLayoutEffect} from "react";

export default function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth || 0);

  useLayoutEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.addEventListener("resize", handleResize);
  }, []);

  return width;
}
