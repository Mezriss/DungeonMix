import { useBoardState } from "@/hooks/useBoardState";
import type { AudioArea } from "@/state";

import styles from "@/styles/AudioArea.module.css";
import { classes } from "@/util/misc";
import { Move, Music, Plus, Trash2 } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";
import { useState } from "react";

// TODO: track selector modal
// TODO: resize handles
// TODO: list of tracks with autoplay toggle and volume control

export default function AudioAreaComponent({
  area,
  temp = false,
}: {
  area: AudioArea;
  temp?: boolean;
}) {
  const { ui, actions } = useBoardState();
  const selected = ui.selectedAreaId === area.id;
  const isInteractive = selected || ui.selectedTool === "select";

  const [move, setMove] = useState<[number, number] | null>(null);
  const [offset, setOffset] = useState<[number, number] | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || selected || !isInteractive) return;

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
      actions.moveArea(area.id, offset[0], offset[1]);
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
        area.shape === "rectangle" ? styles.rectangle : styles.circle,
        selected && styles.selected,
        !isInteractive && styles.nonInteractive,
        temp && styles.temp,
      )}
      style={{
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        ...(move &&
          offset && {
            transform: `translate(${offset[0]}px, ${offset[1]}px)`,
          }),
      }}
    >
      {!temp && selected && (
        <div className={styles.controls}>
          <Tooltip text="Add track">
            <button className={"button"}>
              <Plus size={16} />
              <Music size={16} />
            </button>
          </Tooltip>
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
