import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";
import type { PointerEvent } from "react";

type ShapeDrawingProps = {
  rect: { x: number; y: number; width: number; height: number };
};

export function useShapeDrawing({ rect }: ShapeDrawingProps) {
  const { actions, ui } = useBoardState();
  const [tempShape, setTempShape] = useState<AudioArea | null>(null);

  const startDrawing = (e: PointerEvent) => {
    const editMode = actions.getUI("editMode");
    const selectedTool = actions.getUI("selectedTool");
    if (
      !editMode ||
      e.buttons !== 1 ||
      !["circle", "rectangle"].includes(selectedTool) ||
      e.target !== e.currentTarget
    )
      return;

    setTempShape({
      id: "temp",
      shape: selectedTool as "circle" | "rectangle",
      width: 0,
      height: 0,
      x: (e.clientX - rect.x) * (1 / ui.zoom),
      y: (e.clientY - rect.y) * (1 / ui.zoom),
      tracks: [],
    });
  };

  const draw = (e: PointerEvent) => {
    if (!tempShape) return;
    setTempShape({
      ...tempShape,

      width: (e.clientX - rect.x) * (1 / ui.zoom) - tempShape.x,
      height: (e.clientY - rect.y) * (1 / ui.zoom) - tempShape.y,
    });
  };

  const endDrawing = () => {
    if (tempShape) {
      tempShape.x -= (rect.width / 2) * (1 / ui.zoom);
      tempShape.y -= (rect.height / 2) * (1 / ui.zoom);
      actions.addArea(tempShape);
      setTempShape(null);
    }
  };

  return { tempShape, startDrawing, draw, endDrawing };
}
