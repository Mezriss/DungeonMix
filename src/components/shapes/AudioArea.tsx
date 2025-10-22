import { useState } from "react";
import { type Snapshot } from "valtio";
import AreaControls from "./AreaControls";
import TrackControls from "./TrackControls";
import Tooltip from "@/components/ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

import type { AudioArea } from "@/state";

import { CirclePause, CirclePlay } from "lucide-react";
import styles from "@/styles/AudioArea.module.css";

// TODO: resize handles
// TODO: volume control

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

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!move) return;

    const dx = e.clientX - move[0];
    const dy = e.clientY - move[1];
    setOffset([dx, dy]);
  };

  const handleMoveEnd = () => {
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

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handleMove}
      onPointerUp={handleMoveEnd}
      onPointerLeave={handleMoveEnd}
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
      <div className={styles.tracklist}>
        {area.tracks.map((track) => (
          <div key={track.trackId} className={styles.track}>
            {!ui.editMode && (
              <Tooltip text="Toggle autoplay">
                <button
                  className={classes("button", styles.autoplay)}
                  onClick={() =>
                    actions.toggleTrackAutoplay(area.id, track.trackId)
                  }
                >
                  {track.autoplay ? (
                    <CirclePlay size={16} />
                  ) : (
                    <CirclePause size={16} />
                  )}
                </button>
              </Tooltip>
            )}
            <div className={styles.title}>{data.files[track.trackId].name}</div>
            {ui.editMode && selected && (
              <TrackControls areaId={area.id} track={track} />
            )}
          </div>
        ))}
      </div>

      {selected && (
        <AreaControls area={area} handleMoveStart={handleMoveStart} />
      )}
    </div>
  );
}
