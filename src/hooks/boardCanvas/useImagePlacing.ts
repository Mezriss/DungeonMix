import { useContext } from "react";
import { useSnapshot } from "valtio";
import { BoardStateContext } from "@/providers/BoardStateContext";

import type { PointerEvent } from "react";

type Props = {
  rect: { x: number; y: number; width: number; height: number };
};

export function useImagePlacing({ rect }: Props) {
  const state = useContext(BoardStateContext);
  const ui = useSnapshot(state.ui);

  const placeImage = (e: PointerEvent<HTMLDivElement>) => {
    if (
      !state.ui.editMode ||
      state.ui.selectedTool !== "image" ||
      e.buttons !== 1 ||
      e.target !== e.currentTarget
    )
      return;
    const id = state.actions.addImage(
      (e.clientX - rect.x - rect.width / 2) * (1 / ui.zoom) - ui.position.x,
      (e.clientY - rect.y - rect.height / 2) * (1 / ui.zoom) - ui.position.y,
    );
    state.actions.select(id);
  };

  return { placeImage };
}
