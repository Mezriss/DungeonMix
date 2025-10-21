import { useContext } from "react";
import { useSnapshot } from "valtio";
import { type BoardState, type UIState } from "@/state";
import { BoardStateContext } from "@/providers/BoardStateContext";

export function useBoardState() {
  const state = useContext(BoardStateContext);
  const snap = useSnapshot<BoardState>(state.data);
  const uiSnap = useSnapshot<UIState>(state.ui);
  return {
    data: snap,
    ui: uiSnap,
    actions: state.actions,
  };
}
