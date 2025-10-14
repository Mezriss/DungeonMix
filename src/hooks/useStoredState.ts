import { useEffect, useState } from "react";
import { proxy, subscribe } from "valtio";
import {
  actions,
  getInitialBoardState,
  getInitialUIState,
  type BoardState,
  type State,
} from "../state";
import { STORE_PREFIX } from "../const";

function loadBoardState(id: string): State | null {
  const stored = localStorage.getItem(STORE_PREFIX + id);
  let data: BoardState | null = null;
  if (stored) {
    try {
      data = JSON.parse(stored);
    } catch {
      // TODO: user visible error
      console.error(`Somehow data for board ${id} is corrupted`);
      console.error(stored);
      console.info("Resetting board state");
      data = getInitialBoardState(id);
      localStorage.setItem(STORE_PREFIX + id, JSON.stringify(data));
    }
  }
  if (!data) return null;

  const pData = proxy(data);
  const pUI = proxy(getInitialUIState());
  return {
    data: pData,
    ui: pUI,
    actions: actions(pData, pUI),
  };
}

export function useStoredState(id: string) {
  const [state, setState] = useState<State | null | undefined>(undefined);

  useEffect(() => {
    const boardState = loadBoardState(id);
    setState(boardState);

    const unsubscribe = boardState
      ? subscribe(boardState.data, () => {
          localStorage.setItem(
            STORE_PREFIX + id,
            JSON.stringify(boardState.data),
          );
        })
      : undefined;

    return () => {
      unsubscribe?.();
    };
  }, [id]);

  return {
    state,
    isNotFound: state === null,
  };
}
