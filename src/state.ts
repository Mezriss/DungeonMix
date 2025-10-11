import { createContext, useContext } from "react";
import { useSnapshot, proxy } from "valtio";
import { boardTemplate, KEY_BOARDS, STORE_PREFIX } from "./const";
import type { BoardList } from "./Landing";

export type BoardState = {
  id: string;
  name: string;
  folders: [];
  areas: [];
  sketches: [];
  images: [];
};

export type State = {
  data: BoardState;
  actions: ReturnType<typeof actions>;
};

export function initBoardState(id: string) {
  const stored = localStorage.getItem(STORE_PREFIX + id);
  let data: BoardState | null = null;
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
  return data ? { data: proxy(data), actions: actions(proxy(data)) } : null;
}

export const BoardStateContext = createContext<State>(null!);

export function useBoardState() {
  const state = useContext(BoardStateContext);
  const snap = useSnapshot<BoardState>(state.data);
  return { state: state.data, actions: state.actions, snap };
}

const actions = (state: BoardState) => ({
  updateName: (name: string) => {
    state.name = name;
    try {
      const boardIndex: BoardList = JSON.parse(
        localStorage.getItem(KEY_BOARDS) || "",
      );
      const record = boardIndex.find((board) => board.id === state.id);
      if (record) {
        record.name = state.name;
        localStorage.setItem(KEY_BOARDS, JSON.stringify(boardIndex));
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteBoard: () => {
    const boardIndex: BoardList = JSON.parse(
      localStorage.getItem(KEY_BOARDS) || "",
    );
    const index = boardIndex.findIndex((board) => board.id === state.id);
    if (index !== -1) {
      boardIndex.splice(index, 1);
      localStorage.setItem(KEY_BOARDS, JSON.stringify(boardIndex));
    }
    localStorage.removeItem(STORE_PREFIX + state.id);
    // TODO: clear resources from IDB
  },
});
