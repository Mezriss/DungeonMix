import { Howl } from "howler";
import { del, delMany, get, getMany, set } from "idb-keyval";
import { nanoid } from "nanoid";
import {
  FADE_DURATION,
  KEY_BOARDS,
  MAX_ZOOM,
  MIN_ZOOM,
  STORE_PREFIX,
} from "./const";
import {
  getFileHandleFromPath,
  getFilesRecursively,
  getPermission,
} from "./util/file";
import { clamp, pointInEllipse, pointInRectangle } from "./util/misc";

import type { BoardList } from "./Landing";
import type { AudioArea, BoardState, FileInfo, UIState } from "./state";

export const actions = (state: BoardState, ui: UIState) => {
  const trackCache = new Map<string, Howl>(); // howler breaks when it's put into valtio
  const removeFile = (id: string) => {
    delete state.files[id];
    state.areas.forEach((area) => {
      area.tracks = area.tracks.filter((track) => track.trackId !== id);
    });
    delete ui.tracks[id];
    trackCache.delete(id);
  };

  const initTrack = async (trackId: string) => {
    const dirHandle = await get(STORE_PREFIX + state.files[trackId].folderId);
    try {
      if (!getPermission(dirHandle)) return;
      const fileHandle = await getFileHandleFromPath(
        dirHandle,
        state.files[trackId].path,
      );
      const src = URL.createObjectURL(await fileHandle.getFile());
      trackCache.set(
        trackId,
        new Howl({
          src: src,
          format: state.files[trackId].format,
          volume: 1,
          loop: true,
          autoplay: false,
        }),
      );
      ui.tracks[trackId] = {
        id: trackId,
        status: "stopped",
      };
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getUI: <K extends keyof UIState>(prop: K): UIState[K] => {
      return ui[prop];
    },
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
      try {
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
      } catch (error) {
        console.error(`Failed to add folder ${handle.name}: ${error}`);
      }
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
      if (!getPermission(handle)) return;

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
      area.x -= ui.position.x;
      area.y -= ui.position.y;
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
        volume: 1,
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
    setMarker: async (x: number, y: number) => {
      x -= ui.position.x;
      y -= ui.position.y;
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
      const shouldPlay = areas.flatMap((area) =>
        area.tracks.filter((track) => track.autoplay),
      );
      const shouldPlayIds = shouldPlay.map((track) => track.trackId);
      const currentlyPlayingIds = Object.values(ui.tracks)
        .filter((track) => track.status === "playing")
        .map((track) => track.id);
      const shouldStopIds = currentlyPlayingIds.filter(
        (id) => !shouldPlayIds.includes(id),
      );

      await Promise.all(
        shouldPlay.map(async ({ trackId, volume }) => {
          if (!ui.tracks[trackId]) {
            await initTrack(trackId);
          }
          if (!currentlyPlayingIds.includes(trackId)) {
            const howl = trackCache.get(trackId);
            if (!howl) {
              return console.error(`Track ${trackId} not found in cache`);
            }
            howl.off("fade");
            howl.fade(0, volume, FADE_DURATION);
            howl.play();
            ui.tracks[trackId].status = "playing";
          }
        }),
      );
      shouldStopIds.forEach((trackId) => {
        const howl = trackCache.get(trackId);
        if (!howl) {
          return console.error(`Track ${trackId} not found in cache`);
        }
        howl.fade(howl.volume(), 0, FADE_DURATION);
        ui.tracks[trackId].status = "fadingout";
        howl.once("fade", () => {
          howl.pause();
          ui.tracks[trackId].status = "paused";
        });
      });
      // TODO if there are several areas - determine how they should mix (?)
    },
    moveBoard: (x: number, y: number) => {
      ui.position.x += x;
      ui.position.y += y;
    },
    setZoom: (zoom: number) => {
      ui.zoom = clamp(zoom, MIN_ZOOM, MAX_ZOOM);
    },
    changeZoom: (delta: number) => {
      ui.zoom += delta;
      ui.zoom = clamp(ui.zoom, MIN_ZOOM, MAX_ZOOM);
    },
  };
};
