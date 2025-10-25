import { type Snapshot } from "valtio";
import AreaControls from "./AreaControls";
import TrackControls from "./TrackControls";
import Tooltip from "@/components/ui/Tooltip";
import { useDrag } from "@/hooks/boardCanvas/useDrag";
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
  const selected = ui.selectedId === area.id;
  const isInteractive = selected || ui.selectedTool === "select";

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ui.editMode || e.buttons !== 1 || selected || !isInteractive) return;

    actions.select(area.id);
  };

  const { offset, handleDragStart, handleDrag, handleDragEnd } = useDrag({
    onDragEnd: (moveX, moveY) => {
      actions.moveArea(area.id, moveX, moveY);
    },
  });

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handleDrag}
      onPointerUp={handleDragEnd}
      onPointerLeave={handleDragEnd}
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
        ...(offset && {
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
        <AreaControls area={area} handleMoveStart={handleDragStart} />
      )}
    </div>
  );
}
