import { useState } from "react";
import { type Snapshot } from "valtio";
import TrackAdder from "./TrackAdder";
import Tooltip from "@/components/ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

import type { AudioArea } from "@/state";

import { CirclePlay, Move, Music, Plus, Trash2, Volume1 } from "lucide-react";
import styles from "@/styles/AudioArea.module.css";

// TODO: resize handles
// TODO: list of tracks with autoplay toggle and volume control

export default function AudioAreaComponent({
  area,
  temp = false,
}: {
  area: Snapshot<AudioArea>;
  temp?: boolean;
}) {
  const { ui, actions, data } = useBoardState();
  const selected = ui.selectedAreaId === area.id;
  const isInteractive = selected || ui.selectedTool === "select";

  const [move, setMove] = useState<[number, number] | null>(null);
  const [offset, setOffset] = useState<[number, number] | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ui.editMode || e.buttons !== 1 || selected || !isInteractive) return;

    actions.selectArea(area.id);
  };

  const handleMoveStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!selected || !isInteractive) return;

    setMove([e.clientX, e.clientY]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!move) return;

    const dx = e.clientX - move[0];
    const dy = e.clientY - move[1];
    setOffset([dx, dy]);
  };

  const handlePointerUp = () => {
    if (offset) {
      actions.moveArea(
        area.id,
        offset[0] * (1 / ui.zoom),
        offset[1] * (1 / ui.zoom),
      );
    }
    setMove(null);
    setOffset(null);
  };

  const handlePointerLeave = () => {
    setMove(null);
    setOffset(null);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={classes(
        styles.area,
        area.shape === "circle" && styles.circle,
        selected && styles.selected,
        !isInteractive && styles.nonInteractive,
        temp && styles.temp,
      )}
      style={{
        left: area.x * ui.zoom,
        top: area.y * ui.zoom,
        width: area.width * ui.zoom,
        height: area.height * ui.zoom,
        ...(move &&
          offset && {
            transform: `translate(${offset[0]}px, ${offset[1]}px)`,
          }),
      }}
    >
      {!temp && (
        <div className={styles.tracklist}>
          {area.tracks.map((track) => (
            <div key={track.trackId} className={styles.track}>
              <div className={styles.title}>
                {data.files[track.trackId].name}
              </div>
              {ui.editMode && selected && (
                <div className={styles.controls}>
                  <Tooltip text="Toggle autoplay">
                    <button className={"button"}>
                      <CirclePlay size={16} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Volume">
                    <button className={"button"}>
                      <Volume1 size={16} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Remove track">
                    <button
                      className={"button"}
                      onClick={() =>
                        actions.removeTrackFromArea(area.id, track.trackId)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!temp && selected && (
        <div className={styles.controls}>
          {!!data.folders.length && (
            <TrackAdder areaId={area.id}>
              <Tooltip text="Add track">
                <button className={"button"}>
                  <Plus size={16} />
                  <Music size={16} />
                </button>
              </Tooltip>
            </TrackAdder>
          )}

          <Tooltip text="Hold button to move area">
            <button className={"button"} onPointerDown={handleMoveStart}>
              <Move size={16} />
            </button>
          </Tooltip>
          <Tooltip text="Delete area (there is no undo)">
            <button
              className={"button"}
              onClick={() => actions.deleteArea(area.id)}
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
