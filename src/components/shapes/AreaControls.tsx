import TrackAdder from "./TrackAdder";
import Tooltip from "@/components/ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";
import type { Snapshot } from "valtio";

import { Move, Music, Plus, Trash2 } from "lucide-react";
import styles from "@/styles/AudioArea.module.css";

type Props = {
  area: Snapshot<AudioArea>;
  handleMoveStart: (e: React.PointerEvent<HTMLButtonElement>) => void;
};

export default function AreaControls({ area, handleMoveStart }: Props) {
  const { data, actions } = useBoardState();
  return (
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
  );
}
