import { FADE_DURATION } from "./const";

import type { actions } from "./actions";

export type FileInfo = {
  id: string;
  name: string;
  path: string;
  format: string;
  folderId: string;
};

export type UIState = {
  selectedTool: "select" | "rectangle" | "circle";
  selectedAreaId: string | null;
  editMode: boolean;
  marker: null | { x: number; y: number };
  tracks: {
    [id: string]: {
      id: string;
      src: string;
      status: "playing" | "paused" | "stopped" | "fadingout";
    };
  };
  position: {
    x: number;
    y: number;
  };
  zoom: number;
};

export type Track = {
  trackId: string;
  autoplay: boolean;
  volume: number;
};

export type AudioArea = {
  id: string;
  shape: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  tracks: Track[];
};

export type BoardState = {
  id: string;
  name: string;
  folders: { id: string; name: string }[];
  files: { [id: string]: FileInfo };
  areas: AudioArea[];
  sketches: [];
  images: [];
  settings: {
    fadeDuration: number;
  };
};

export type State = {
  data: BoardState;
  actions: ReturnType<typeof actions>;
  ui: UIState;
};

export const getInitialBoardState = (id: string): BoardState => ({
  id,
  name: "",
  folders: [],
  files: {},
  areas: [],
  sketches: [],
  images: [],
  settings: {
    fadeDuration: FADE_DURATION,
  },
});

export const getInitialUIState = (): UIState => ({
  selectedTool: "select",
  selectedAreaId: null,
  editMode: true,
  marker: null,
  tracks: {},
  position: {
    x: 0,
    y: 0,
  },
  zoom: 1,
});

export const migrations = [
  (data: BoardState) => {
    if (!data.settings) {
      data.settings = {
        fadeDuration: FADE_DURATION,
      };
    }
    return data;
  },
];
