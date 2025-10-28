import { MAX_ZOOM, MIN_ZOOM } from "@/const";
import { clamp } from "@/util/misc";

import type { UIState } from "@/state";

export const uiActions = (ui: UIState) => ({
  select: (id: string | null) => {
    ui.selectedId = id;
  },
  toggleEditMode: (val: boolean) => {
    ui.editMode = val;
    ui.selectedTool = "select";
    if (!val) {
      ui.selectedId = null;
    }
  },
  switchTool: (tool: UIState["selectedTool"]) => {
    ui.selectedTool = tool;
    ui.selectedId = null;
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
});
