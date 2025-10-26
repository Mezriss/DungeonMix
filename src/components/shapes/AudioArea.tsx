import { createPortal } from "react-dom";
import { type Snapshot } from "valtio";
import AreaControls from "./AreaControls";
import Tooltip from "@/components/ui/Tooltip";
import { useDrag } from "@/hooks/boardCanvas/useDrag";
import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

import type { AudioArea } from "@/state";

import { CirclePause, CirclePlay } from "lucide-react";
import styles from "@/styles/AudioArea.module.css";

// TODO: resize handles

type Props = {
  area: Snapshot<AudioArea>;
  rect: { x: number; y: number; width: number; height: number };
  temp?: boolean;
};

export default function AudioArea({ area, rect, temp = false }: Props) {
  const { ui, actions, data } = useBoardState();
  const selected = ui.selectedId === area.id;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (ui.editMode && e.buttons === 1 && ui.selectedTool === "select") {
      actions.select(area.id);
    }
  };

  const { offset, handleDragStart, handleDrag, handleDragEnd } = useDrag({
    onDragEnd: (moveX, moveY) => {
      actions.moveArea(area.id, moveX, moveY);
    },
  });

  const absoluteAreaCenter = {
    x:
      rect.x +
      rect.width / 2 +
      ui.position.x +
      (area.x + area.width / 2) * ui.zoom,
    y:
      rect.y +
      rect.height / 2 +
      ui.position.y +
      (area.y + area.height / 2) * ui.zoom,
  };
  if (offset) {
    absoluteAreaCenter.x += offset[0];
    absoluteAreaCenter.y += offset[1];
  }

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
        temp && styles.temp,
      )}
      style={{
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        ...(offset && {
          transform: `translate(${offset[0]}px, ${offset[1]}px)`,
        }),
      }}
    >
      <div className={styles.tracklist}>
        {area.tracks.map((track) => (
          <div key={track.trackId} className={styles.track}>
            {!ui.editMode ? (
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
            ) : track.autoplay ? (
              <CirclePlay size={16} />
            ) : (
              <CirclePause size={16} />
            )}
            <div className={styles.title}>{data.files[track.trackId].name}</div>
          </div>
        ))}
      </div>

      {ui.editMode &&
        selected &&
        createPortal(
          <div
            className={classes(styles.controlsPanel, "panel")}
            style={{
              left: absoluteAreaCenter.x,
              top: absoluteAreaCenter.y,
            }}
          >
            <AreaControls area={area} handleMoveStart={handleDragStart} />
          </div>,
          document.body,
        )}
    </div>
  );
}
