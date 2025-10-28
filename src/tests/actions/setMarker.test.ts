import { beforeEach, describe, expect, it, vi } from "vitest";
import { actions } from "@/actions";
import { getInitialBoardState, getInitialUIState } from "@/state";

import type { BoardState, UIState } from "@/state";

describe("setMarker", () => {
  let data: BoardState;
  let ui: UIState;

  beforeEach(() => {
    data = getInitialBoardState("board-1");
    ui = getInitialUIState();

    const { addArea, addTrackToArea } = actions(data, ui);
    addArea({
      id: "temp",
      shape: "rectangle",
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      tracks: [],
    });
    addArea({
      id: "temp",
      shape: "rectangle",
      x: 5,
      y: 5,
      width: 15,
      height: 15,
      tracks: [],
    });
    addTrackToArea(data.areas[0].id, "track-1");
    data.files["track-1"] = {
      id: "track-1",
      name: "track-1",
      path: "track-1.mp3",
      format: "mp3",
      folderId: "folder-1",
    };
    addTrackToArea(data.areas[1].id, "track-2");
    data.files["track-2"] = {
      id: "track-2",
      name: "track-2",
      path: "track-2.mp3",
      format: "mp3",
      folderId: "folder-1",
    };

    vi.mock("idb-keyval", () => ({
      get: vi.fn().mockResolvedValue("test"),
    }));
    vi.mock("@/util/file.ts", () => ({
      getPermission: vi.fn().mockResolvedValue(true),
      getFileHandleFromPath: () =>
        Promise.resolve({
          getFile: () => Promise.resolve({}),
        }),
    }));

    vi.spyOn(URL, "createObjectURL").mockReturnValue("test");
  });

  it("should set marker to new position", async () => {
    const { setMarker } = actions(data, ui);
    await setMarker({ x: 1, y: 2 });
    expect(ui.marker).toEqual({ x: 1, y: 2 });
  });

  it("should init tracks outside of track cache", async () => {
    const { setMarker } = actions(data, ui);
    await setMarker({ x: 1, y: 1 });
    expect(ui.tracks["track-1"]).toBeDefined();
  });
  it("should play tracks that are in hit areas");
  it("should fade out tracks outside of hit areas");
});
