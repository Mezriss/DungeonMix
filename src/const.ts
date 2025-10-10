import type { BoardState } from "./state";

export const STORE_PREFIX = "dungeonmix:";
export const KEY_BOARDS = STORE_PREFIX + "boards";

export const boardTemplate = (id: string): BoardState => ({
  id,
  name: "",
  folders: [],
  areas: [],
  sketches: [],
  images: [],
});
