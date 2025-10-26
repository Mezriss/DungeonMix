import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";
import type { PointerEvent } from "react";

type Props = {
  rect: { x: number; y: number; width: number; height: number };
};

export function useShapeDrawing({ rect }: Props) {
  const { actions, ui } = useBoardState();
  const [tempShape, setTempShape] = useState<AudioArea | null>(null);

  const startDrawing = (e: PointerEvent) => {
    const { editMode, selectedTool } = ui;
    if (
      !editMode ||
      e.buttons !== 1 ||
      !["circle", "rectangle"].includes(selectedTool) ||
      (e.target as HTMLElement).closest("button")
    )
      return;

    setTempShape({
      id: "temp",
      shape: selectedTool as "circle" | "rectangle",
      width: 0,
      height: 0,
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
      tracks: [],
    });
  };

  const draw = (e: PointerEvent) => {
    if (!tempShape) return;
    setTempShape({
      ...tempShape,

      width: e.clientX - rect.x - tempShape.x,
      height: e.clientY - rect.y - tempShape.y,
    });
  };

  const endDrawing = () => {
    if (tempShape) {
      console.info(tempShape.x, tempShape.y);
      tempShape.x =
        (tempShape.x - ui.position.x - rect.width / 2) * (1 / ui.zoom);
      tempShape.y =
        (tempShape.y - ui.position.y - rect.height / 2) * (1 / ui.zoom);
      tempShape.width *= 1 / ui.zoom;
      tempShape.height *= 1 / ui.zoom;
      actions.addArea(tempShape);
      setTempShape(null);
    }
  };

  return { tempShape, startDrawing, draw, endDrawing };
}
