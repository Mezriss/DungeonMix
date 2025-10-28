import { del, get, getMany, set } from "idb-keyval";
import { nanoid } from "nanoid";
import { STORE_PREFIX } from "@/const";
import { getFilesRecursively, getPermission } from "@/util/file";

import type { BoardState, FileInfo, UIState } from "@/state";

export const libraryActions = (
  data: BoardState,
  ui: UIState,
  trackCache: Map<string, Howl>,
) => {
  const removeFile = (id: string) => {
    delete data.files[id];
    data.areas.forEach((area) => {
      area.tracks = area.tracks.filter((track) => track.trackId !== id);
    });
    delete ui.tracks[id];
    trackCache.delete(id);
  };
  return {
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
  };
};
