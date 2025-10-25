import { useBoardState } from "../useBoardState";

import type { PointerEvent } from "react";

type Props = {
  rect: { x: number; y: number; width: number; height: number };
};

export function useImagePlacing({ rect }: Props) {
  const { ui, actions } = useBoardState();

  const placeImage = (e: PointerEvent<HTMLDivElement>) => {
    if (
      !ui.editMode ||
      ui.selectedTool !== "image" ||
      e.buttons !== 1 ||
      e.target !== e.currentTarget
    )
      return;
    const id = actions.addImage(
      (e.clientX - rect.x - rect.width / 2) * (1 / ui.zoom) - ui.position.x,
      (e.clientY - rect.y - rect.height / 2) * (1 / ui.zoom) - ui.position.y,
    );
    actions.select(id);
  };

  return { placeImage };
}
