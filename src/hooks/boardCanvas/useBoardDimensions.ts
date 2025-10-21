import { useEffect, useState } from "react";

import type { RefObject } from "react";

export function useBoardDimensions(ref: RefObject<HTMLElement>) {
  const [rect, setRect] = useState({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateDimensions = () => {
      setRect(element.getBoundingClientRect());
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [ref]);

  return rect;
}
