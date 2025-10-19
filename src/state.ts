import { KEY_BOARDS, STORE_PREFIX } from "./const";
import type { BoardList } from "./Landing";
import { nanoid } from "nanoid";
import { get, set, getMany, del, delMany } from "idb-keyval";
import { getFilesRecursively } from "./util/file";
import { pointInEllipse, pointInRectangle } from "./util/misc";

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
      src: string;
      howl: Howl;
    };
  };
};

export type AudioArea = {
  id: string;
  shape: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  tracks: {
    trackId: string;
    autoplay: boolean;
    volume: number;
  }[];
};

export type BoardState = {
  id: string;
  name: string;
  folders: { id: string; name: string }[];
  files: { [id: string]: FileInfo };
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
  files: {},
  areas: [],
  sketches: [],
  images: [],
});

export const getInitialUIState = (): UIState => ({
  selectedTool: "select",
  selectedAreaId: null,
  editMode: true,
  marker: null,
  tracks: {},
});

export const actions = (state: BoardState, ui: UIState) => {
  const removeFile = (id: string) => {
    delete state.files[id];
    state.areas.forEach((area) => {
      area.tracks = area.tracks.filter((track) => track.trackId !== id);
    });
    delete ui.tracks[id];
  };

  return {
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
      for await (const { file, path } of getFilesRecursively(handle)) {
        const fullPath = path ? `${path}/${file.name}` : file.name;
        const fileId = nanoid();
        const info: FileInfo = {
          id: fileId,
          path: fullPath,
          name: file.name.replace(/\.[^.]+$/, ""),
          format: file.name.split(".").pop() || "",
          folderId: id,
        };
        state.files[fileId] = info;
      }
      state.folders.push({
        id,
        name: handle.name,
      });
      await set(STORE_PREFIX + id, handle);
    },
    removeFolder: async (id: string) => {
      const index = state.folders.findIndex((folder) => folder.id === id);
      if (index !== -1) {
        state.folders.splice(index, 1);
      }
      for (const key in state.files) {
        const file = state.files[key];
        if (file.folderId === id) {
          removeFile(file.id);
        }
      }
      await del(STORE_PREFIX + id);
    },
    refreshFolder: async (folderId: string) => {
      // TODO: user visible errors
      const folder = state.folders.find((folder) => folder.id === folderId);
      if (!folder) {
        return console.error(`Folder ${folderId} is missing from state`);
      }
      const handle: FileSystemDirectoryHandle | undefined = await get(
        STORE_PREFIX + folderId,
      );

      if (!handle) {
        return console.error(
          `Folder ${folderId} handle is missing from storage`,
        );
      }
      if ((await handle.queryPermission({ mode: "read" })) !== "granted") {
        if ((await handle.requestPermission({ mode: "read" })) !== "granted") {
          return console.error(
            `Folder ${folderId} does not have read permission`,
          );
        }
      }

      const files: { path: string; name: string }[] = [];
      for await (const { file, path } of getFilesRecursively(handle)) {
        const fullPath = path ? `${path}/${file.name}` : file.name;
        files.push({ path: fullPath, name: file.name });
      }
      const removedFiles = Object.values(state.files)
        .filter(
          (file) =>
            file.folderId === folderId &&
            !files.some((f) => f.path === file.path),
        )
        .map((file) => file.id);
      removedFiles.forEach(removeFile);

      files.forEach(({ path, name }) => {
        if (
          !Object.values(state.files).some(
            (f) => f.folderId === folderId && f.path === path,
          )
        ) {
          const fileId = nanoid();
          const info: FileInfo = {
            id: fileId,
            path: path,
            name: name.replace(/\.[^.]+$/, ""),
            format: name.split(".").pop() || "",
            folderId: folderId,
          };
          state.files[fileId] = info;
        }
      });
    },
    switchTool: (tool: UIState["selectedTool"]) => {
      ui.selectedTool = tool;
      ui.selectedAreaId = null;
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
    selectArea: (id: string | null) => {
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
    addTrackToArea(areaId: string, trackId: string) {
      const area = state.areas.find((area) => area.id === areaId);
      if (!area) {
        return console.error(`Area ${areaId} is missing from state`);
      }
      area.tracks.push({
        trackId,
        autoplay: true,
        volume: 100,
      });
    },
    removeTrackFromArea(areaId: string, trackId: string) {
      const area = state.areas.find((area) => area.id === areaId);
      if (!area) {
        return console.error(`Area ${areaId} is missing from state`);
      }
      const index = area.tracks.findIndex((track) => track.trackId === trackId);
      if (index === -1) {
        return console.error(`Track ${trackId} is missing from area ${areaId}`);
      }
      area.tracks.splice(index, 1);
    },
    toggleEditMode: (val: boolean) => {
      ui.editMode = val;
      ui.selectedTool = "select";
      if (!val) {
        ui.selectedAreaId = null;
      }
    },
    setMarker: (x: number, y: number) => {
      ui.marker = { x, y };
      const areas = state.areas.filter((area) => {
        if (area.shape === "rectangle") {
          return pointInRectangle(x, y, {
            x: area.x,
            y: area.y,
            width: area.width,
            height: area.height,
          });
        }
        if (area.shape === "circle") {
          return pointInEllipse(x, y, {
            x: area.x + area.width / 2,
            y: area.y + area.height / 2,
            radiusX: area.width / 2,
            radiusY: area.height / 2,
          });
        }
      });
      console.info(areas);
      // resolve tracks, cache them if needed
      // TODO if there are several areas - determine how they should mix (?)
      // fade out previous tracks, fade in new tracks
    },
  };
};
