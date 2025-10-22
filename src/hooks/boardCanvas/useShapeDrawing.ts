import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";
import type { PointerEvent } from "react";

type ShapeDrawingProps = {
  rect: { x: number; y: number };
};

export function useShapeDrawing({ rect }: ShapeDrawingProps) {
  const { actions } = useBoardState();
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
      actions.addArea(tempShape);
      setTempShape(null);
    }
  };

  return { tempShape, startDrawing, draw, endDrawing };
}
