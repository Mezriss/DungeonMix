import { Howl } from "howler";
import { del, delMany, get, getMany, set } from "idb-keyval";
import { nanoid } from "nanoid";
import { KEY_BOARDS, MAX_ZOOM, MIN_ZOOM, STORE_PREFIX } from "./const";
import {
  getFileHandleFromPath,
  getFilesRecursively,
  getPermission,
} from "./util/file";
import { clamp, pointInEllipse, pointInRectangle } from "./util/misc";

import type { BoardList } from "./Landing";
import type { AudioArea, BoardState, FileInfo, UIState } from "./state";

export const actions = (data: BoardState, ui: UIState) => {
  const trackCache = new Map<string, Howl>(); // howler breaks when it's put into valtio
  let volumePreview: null | {
    howl: Howl;
    timeout: number;
    trackId: string;
  } = null;
  const clearVolumePreview = () => {
    if (!volumePreview) return;
    clearTimeout(volumePreview.timeout);
    volumePreview.howl.stop();
    volumePreview = null;
  };

  const removeFile = (id: string) => {
    delete data.files[id];
    data.areas.forEach((area) => {
      area.tracks = area.tracks.filter((track) => track.trackId !== id);
    });
    delete ui.tracks[id];
    trackCache.delete(id);
  };

  const initTrack = async (trackId: string) => {
    const dirHandle = await get(STORE_PREFIX + data.files[trackId].folderId);
    try {
      if (!getPermission(dirHandle)) return;
      const fileHandle = await getFileHandleFromPath(
        dirHandle,
        data.files[trackId].path,
      );
      const src = URL.createObjectURL(await fileHandle.getFile());
      trackCache.set(
        trackId,
        new Howl({
          src: src,
          format: data.files[trackId].format,
          volume: 1,
          loop: true,
          autoplay: false,
        }),
      );
      ui.tracks[trackId] = {
        id: trackId,
        src: src,
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
      data.name = name;
      try {
        const boardIndex: BoardList = JSON.parse(
          localStorage.getItem(KEY_BOARDS) || "",
        );
        const record = boardIndex.find((board) => board.id === data.id);
        if (record) {
          record.name = data.name;
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
      const index = boardIndex.findIndex((board) => board.id === data.id);
      if (index !== -1) {
        boardIndex.splice(index, 1);
        localStorage.setItem(KEY_BOARDS, JSON.stringify(boardIndex));
      }
      localStorage.removeItem(STORE_PREFIX + data.id);
      const existingHandleIds = data.folders.map(
        (folder) => STORE_PREFIX + folder.id,
      );
      await delMany(existingHandleIds);
      // TODO: clear other resources from IDB (images?)
    },
    addFolder: async (handle: FileSystemDirectoryHandle) => {
      try {
        const id = nanoid();
        if (data.folders.length) {
          const existingHandleIds = data.folders.map(
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
          data.files[fileId] = info;
        }
        data.folders.push({
          id,
          name: handle.name,
        });
        await set(STORE_PREFIX + id, handle);
      } catch (error) {
        console.error(`Failed to add folder ${handle.name}: ${error}`);
      }
    },
    removeFolder: async (id: string) => {
      const index = data.folders.findIndex((folder) => folder.id === id);
      if (index !== -1) {
        data.folders.splice(index, 1);
      }
      for (const key in data.files) {
        const file = data.files[key];
        if (file.folderId === id) {
          removeFile(file.id);
        }
      }
      await del(STORE_PREFIX + id);
    },
    refreshFolder: async (folderId: string) => {
      // TODO: user visible errors
      const folder = data.folders.find((folder) => folder.id === folderId);
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
      const removedFiles = Object.values(data.files)
        .filter(
          (file) =>
            file.folderId === folderId &&
            !files.some((f) => f.path === file.path),
        )
        .map((file) => file.id);
      removedFiles.forEach(removeFile);

      files.forEach(({ path, name }) => {
        if (
          !Object.values(data.files).some(
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
          data.files[fileId] = info;
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
      data.areas.push(area);
      ui.selectedAreaId = area.id;
    },
    selectArea: (id: string | null) => {
      ui.selectedAreaId = id;
    },
    deleteArea: (id: string) => {
      const index = data.areas.findIndex((area) => area.id === id);
      if (index === -1) {
        return console.error(`Area ${id} is missing from state`);
      }
      data.areas.splice(index, 1);
    },
    moveArea: (id: string, x: number, y: number) => {
      const area = data.areas.find((area) => area.id === id);
      if (!area) {
        return console.error(`Area ${id} is missing from state`);
      }
      area.x += x;
      area.y += y;
    },
    addTrackToArea(areaId: string, trackId: string) {
      const area = data.areas.find((area) => area.id === areaId);
      if (!area) {
        return console.error(`Area ${areaId} is missing from state`);
      }
      if (area.tracks.some((track) => track.trackId === trackId)) {
        return console.error(`Track ${trackId} is already in area ${areaId}`);
      }
      area.tracks.push({
        trackId,
        autoplay: true,
        volume: 1,
      });
    },
    removeTrackFromArea(areaId: string, trackId: string) {
      const area = data.areas.find((area) => area.id === areaId);
      if (!area) {
        return console.error(`Area ${areaId} is missing from state`);
      }
      const index = area.tracks.findIndex((track) => track.trackId === trackId);
      if (index === -1) {
        return console.error(`Track ${trackId} is missing from area ${areaId}`);
      }
      area.tracks.splice(index, 1);
    },
    toggleTrackAutoplay(areaId: string, trackId: string) {
      const area = data.areas.find((area) => area.id === areaId);
      if (!area) {
        return console.error(`Area ${areaId} is missing from state`);
      }
      const track = area.tracks.find((track) => track.trackId === trackId);
      if (!track) {
        return console.error(`Track ${trackId} is missing from area ${areaId}`);
      }
      track.autoplay = !track.autoplay;
      if (ui.marker) {
        this.setMarker();
      }
    },
    setTrackVolume(areaId: string, trackId: string, volume: number) {
      const area = data.areas.find((area) => area.id === areaId);
      if (!area) {
        return console.error(`Area ${areaId} is missing from state`);
      }
      const track = area.tracks.find((track) => track.trackId === trackId);
      if (!track) {
        return console.error(`Track ${trackId} is missing from area ${areaId}`);
      }
      track.volume = volume;
      // let's assume that user switched to edit mode to quickly adjust volume
      // there is an edge case of 2 areas with same track and user changing volume of the inactive one
      // but it will be ignored for now
      if (ui.tracks[trackId]?.status === "playing") {
        trackCache.get(trackId)?.volume(volume);
      }
      clearVolumePreview();
    },
    async previewVolume(trackId: string, volume: number) {
      if (!ui.tracks[trackId]) {
        await initTrack(trackId);
      }
      try {
        if (!volumePreview || volumePreview.trackId !== trackId) {
          volumePreview = {
            trackId,
            howl: new Howl({
              src: ui.tracks[trackId].src,
              format: data.files[trackId].format,
              volume: volume,
              loop: true,
              autoplay: false,
            }),
            timeout: setTimeout(clearVolumePreview, 3000),
          };
          volumePreview.howl.seek(volumePreview.howl.duration() / 2);
          volumePreview.howl.play();
        } else {
          volumePreview.howl.volume(volume);
          clearTimeout(volumePreview.timeout);
          volumePreview.timeout = setTimeout(clearVolumePreview, 3000);
        }
      } catch (error) {
        console.error(error);
      }
    },

    toggleEditMode: (val: boolean) => {
      ui.editMode = val;
      ui.selectedTool = "select";
      if (!val) {
        ui.selectedAreaId = null;
      }
    },
    setMarker: async (position = ui.marker) => {
      ui.marker = position;
      if (ui.marker === null) return;
      const areas = data.areas.filter((area) => {
        if (area.shape === "rectangle") {
          return (
            ui.marker &&
            pointInRectangle(ui.marker.x, ui.marker.y, {
              x: area.x,
              y: area.y,
              width: area.width,
              height: area.height,
            })
          );
        }
        if (area.shape === "circle") {
          return (
            ui.marker &&
            pointInEllipse(ui.marker.x, ui.marker.y, {
              x: area.x + area.width / 2,
              y: area.y + area.height / 2,
              radiusX: area.width / 2,
              radiusY: area.height / 2,
            })
          );
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
            howl.fade(0, volume, data.settings.fadeDuration);
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
        howl.fade(howl.volume(), 0, data.settings.fadeDuration);
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
    setFadeDuration: (duration: number) => {
      data.settings.fadeDuration = duration;
    },
  };
};
