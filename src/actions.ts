import { Howl } from "howler";
import { get } from "idb-keyval";
import { areaActions } from "./actions/area";
import { boardActions } from "./actions/board";
import { imageActions } from "./actions/image";
import { libraryActions } from "./actions/library";
import { settingsActions } from "./actions/settings";
import { trackActions } from "./actions/track";
import { uiActions } from "./actions/ui";
import { STORE_PREFIX } from "./const";
import { getFileHandleFromPath, getPermission } from "./util/file";

import type { BoardState, UIState } from "./state";

export const actions = (data: BoardState, ui: UIState) => {
  const trackCache = new Map<string, Howl>(); // howler breaks when it's put into valtio

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
    ...boardActions(data),
    ...libraryActions(data, ui, trackCache),
    ...imageActions(data),
    ...uiActions(ui),
    ...settingsActions(data),
    ...areaActions(data, ui),
    ...trackActions(data, ui, trackCache, initTrack),
  };
};
