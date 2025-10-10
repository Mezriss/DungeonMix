import { createContext, useContext } from "react";
import { useSnapshot, proxy } from "valtio";
import { boardTemplate, STORE_PREFIX } from "./const";

export type BoardState = {
  id: string;
  name: string;
  folders: [];
  areas: [];
  sketches: [];
  images: [];
};

export function initBoardState(id: string): BoardState | null {
  const stored = localStorage.getItem(STORE_PREFIX + id);
  let data;
  if (stored) {
    try {
      data = JSON.parse(stored);
    } catch {
      console.error(`Somehow data for board ${id} is corrupted`);
      console.error(stored);
      console.info("Resetting board state");
      data = boardTemplate(id);
      localStorage.setItem(STORE_PREFIX + id, JSON.stringify(data));
    }
  }
  return data ? proxy(data) : null;
}

export const BoardStateContext = createContext<BoardState>(null!);

export function useBoardState() {
  const state = useContext(BoardStateContext);
  const snap = useSnapshot<BoardState>(state);
  return { state, snap };
}
