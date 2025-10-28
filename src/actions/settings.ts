import type { BoardState } from "@/state";

export const settingsActions = (data: BoardState) => ({
  setFadeDuration: (duration: number) => {
    data.settings.fadeDuration = duration;
  },
  setAreaOpacity: (opacity: number) => {
    data.settings.areaOpacity = opacity;
  },
});
