import { KEY_BOARDS, STORE_PREFIX } from "./const";
import type { BoardList } from "./Landing";
import { nanoid } from "nanoid";
import { get, set, getMany, del, delMany } from "idb-keyval";
import { getFilesRecursively } from "./util/file";

export type FileInfo = {
  name: string;
  path: string;
};

export type UIState = {
  selectedTool: "select" | "rectangle" | "circle";
  selectedAreaId: string | null;
};

export type AudioArea = {
  id: string;
  shape: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoardState = {
  id: string;
  name: string;
  folders: { id: string; name: string; files: FileInfo[] }[];
  areas: AudioArea[];
  sketches: [];
  images: [];
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
  areas: [],
  sketches: [],
  images: [],
});

export const getInitialUIState = (): UIState => ({
  selectedTool: "select",
  selectedAreaId: null,
});

export const actions = (state: BoardState, ui: UIState) => ({
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
  deleteBoard: async () => {
    const boardIndex: BoardList = JSON.parse(
      localStorage.getItem(KEY_BOARDS) || "",
    );
    const index = boardIndex.findIndex((board) => board.id === state.id);
    if (index !== -1) {
      boardIndex.splice(index, 1);
      localStorage.setItem(KEY_BOARDS, JSON.stringify(boardIndex));
    }
    localStorage.removeItem(STORE_PREFIX + state.id);
    const existingHandleIds = state.folders.map(
      (folder) => STORE_PREFIX + folder.id,
    );
    await delMany(existingHandleIds);
    // TODO: clear other resources from IDB (images?)
  },
  addFolder: async (handle: FileSystemDirectoryHandle) => {
    const id = nanoid();
    if (state.folders.length) {
      const existingHandleIds = state.folders.map(
        (folder) => STORE_PREFIX + folder.id,
      );
      const existingHandles: FileSystemDirectoryHandle[] =
        await getMany(existingHandleIds);
      for (const existingHandle of existingHandles) {
        if (await existingHandle.isSameEntry(handle)) {
          return;
        }
      }
    }
    const files: FileInfo[] = [];
    for await (const { file, path } of getFilesRecursively(handle)) {
      const fullPath = path ? `${path}/${file.name}` : file.name;

      files.push({
        name: file.name,
        path: fullPath,
      });
    }
    files.sort((a, b) => a.path.localeCompare(b.path));
    state.folders.push({
      id,
      name: handle.name,
      files,
    });
    await set(STORE_PREFIX + id, handle);
  },
  removeFolder: async (id: string) => {
    const index = state.folders.findIndex((folder) => folder.id === id);
    if (index !== -1) {
      state.folders.splice(index, 1);
    }
    // TODO: find and remove tracks from this folder that were used in areas
    await del(STORE_PREFIX + id);
  },
  refreshFolder: async (id: string) => {
    // TODO: user visible errors
    const folder = state.folders.find((folder) => folder.id === id);
    if (!folder) {
      return console.error(`Folder ${id} is missing from state`);
    }
    const handle: FileSystemDirectoryHandle | undefined = await get(
      STORE_PREFIX + id,
    );

    if (!handle) {
      return console.error(`Folder ${id} handle is missing from storage`);
    }
    if ((await handle.queryPermission({ mode: "read" })) !== "granted") {
      if ((await handle.requestPermission({ mode: "read" })) !== "granted") {
        return console.error(`Folder ${id} does not have read permission`);
      }
    }

    const files: FileInfo[] = [];
    for await (const { file, path } of getFilesRecursively(handle)) {
      const fullPath = path ? `${path}/${file.name}` : file.name;

      files.push({
        name: file.name,
        path: fullPath,
      });
    }
    files.sort((a, b) => a.path.localeCompare(b.path));
    folder.files = files;
  },
  switchTool: (tool: UIState["selectedTool"]) => {
    ui.selectedTool = tool;
  },
  addArea: (shape: AudioArea) => {
    const area = {
      ...shape,
      id: nanoid(),
    };
    area.width = Math.max(area.width, 100);
    area.height = Math.max(area.height, 100);
    state.areas.push(area);
    ui.selectedAreaId = area.id;
  },
  selectArea: (id: string) => {
    ui.selectedAreaId = id;
  },
  deleteArea: (id: string) => {
    const index = state.areas.findIndex((area) => area.id === id);
    if (index === -1) {
      return console.error(`Area ${id} is missing from state`);
    }
    state.areas.splice(index, 1);
  },
  moveArea: (id: string, x: number, y: number) => {
    const area = state.areas.find((area) => area.id === id);
    if (!area) {
      return console.error(`Area ${id} is missing from state`);
    }
    area.x += x;
    area.y += y;
  },
});
