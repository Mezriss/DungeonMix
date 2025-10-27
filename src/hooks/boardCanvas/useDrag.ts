import { useRef } from "react";

import type { RefObject } from "react";

type Props = {
  refs: RefObject<HTMLDivElement>[];
  onUpdate: (moveX: number, moveY: number) => void;
};

export function useDrag({ refs, onUpdate }: Props) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onDragStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    start.current = { x: e.clientX, y: e.clientY };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!start.current) return;
    for (const ref of refs) {
      ref.current.style.setProperty("--dx", `${e.clientX - start.current.x}px`);
      ref.current.style.setProperty("--dy", `${e.clientY - start.current.y}px`);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    for (const ref of refs) {
      ref.current?.style.removeProperty("--dx");
      ref.current?.style.removeProperty("--dy");
    }
    onUpdate(e.clientX - start.current!.x, e.clientY - start.current!.y);
    start.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  return {
    onDragStart,
  };
}
