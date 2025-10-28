import { areaActions } from "./actions/area";
import { boardActions } from "./actions/board";
import { imageActions } from "./actions/image";
import { libraryActions } from "./actions/library";
import { settingsActions } from "./actions/settings";
import { trackActions } from "./actions/track";
import { uiActions } from "./actions/ui";

import type { BoardState, UIState } from "./state";

export const actions = (data: BoardState, ui: UIState) => {
  const trackCache = new Map<string, Howl>(); // howler breaks when it's put into valtio

  return {
    ...boardActions(data),
    ...libraryActions(data, ui, trackCache),
    ...imageActions(data),
    ...uiActions(ui),
    ...settingsActions(data),
    ...areaActions(data, ui),
    ...trackActions(data, ui, trackCache),
  };
};
