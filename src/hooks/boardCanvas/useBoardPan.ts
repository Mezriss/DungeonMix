import { useRef, useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import type { PointerEvent } from "react";

export function useBoardPan() {
  const { actions, ui } = useBoardState();
  const panStartCoords = useRef({ x: 0, y: 0 });
  const [panDelta, setPanDelta] = useState({ x: 0, y: 0 });

  function startPan(event: PointerEvent<HTMLDivElement>) {
    if (event.buttons === 4) {
      panStartCoords.current = { x: event.clientX, y: event.clientY };
    }
  }

  function pan(event: PointerEvent<HTMLDivElement>) {
    const { x, y } = panStartCoords.current;
    if (!x && !y) return;
    setPanDelta({ x: event.clientX - x, y: event.clientY - y });
  }

  function endPan(event: PointerEvent<HTMLDivElement>) {
    const { x, y } = panStartCoords.current;
    if (!x && !y) return;
    actions.moveBoard(
      (event.clientX - x) * (1 / ui.zoom),
      (event.clientY - y) * (1 / ui.zoom),
    );
    setPanDelta({ x: 0, y: 0 });
    panStartCoords.current = { x: 0, y: 0 };
  }

  return { panDelta, startPan, pan, endPan };
}
