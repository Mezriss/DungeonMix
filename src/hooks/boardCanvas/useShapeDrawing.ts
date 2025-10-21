import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";

type ShapeDrawingProps = {
  rect: { x: number; y: number };
};

export function useShapeDrawing({ rect }: ShapeDrawingProps) {
  const { actions } = useBoardState();
  const [tempShape, setTempShape] = useState<AudioArea | null>(null);

  const startDrawing = (e: React.PointerEvent) => {
    const editMode = actions.getUI("editMode");
    const selectedTool = actions.getUI("selectedTool");
    if (!editMode || !["circle", "rectangle"].includes(selectedTool)) return;
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

  const draw = (e: React.PointerEvent) => {
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
