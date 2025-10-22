import Tooltip from "@/components/ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";

import { CirclePause, CirclePlay, Trash2, Volume1 } from "lucide-react";
import styles from "@/styles/AudioArea.module.css";

export default function TrackControls({
  areaId,
  track,
}: {
  areaId: string;
  track: AudioArea["tracks"][number];
}) {
  const { actions } = useBoardState();
  return (
    <div className={styles.controls}>
      <Tooltip text="Toggle autoplay">
        <button
          className={"button"}
          onClick={() => actions.toggleTrackAutoplay(areaId, track.trackId)}
        >
          {track.autoplay ? (
            <CirclePlay size={16} />
          ) : (
            <CirclePause size={16} />
          )}
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
          onClick={() => actions.removeTrackFromArea(areaId, track.trackId)}
        >
          <Trash2 size={16} />
        </button>
      </Tooltip>
    </div>
  );
}
