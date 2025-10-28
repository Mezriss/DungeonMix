import { t } from "@lingui/core/macro";
import { useContext, useEffect, useState } from "react";
import Slider from "@/components/ui/Slider";
import Tooltip from "@/components/ui/Tooltip";
import { BoardStateContext } from "@/providers/BoardStateContext";

import type { Track } from "@/state";

import { Volume1 } from "lucide-react";
import styles from "@/styles/AreaControls.module.css";

type Props = {
  areaId: string;
  track: Track;
};

export default function VolumeControl({ areaId, track }: Props) {
  const { actions } = useContext(BoardStateContext);
  const [volume, setVolume] = useState(track.volume * 100);
  useEffect(() => {
    setVolume(track.volume * 100);
  }, [track.volume]);
  const onComit = (value: number) => {
    actions.setTrackVolume(areaId, track.trackId, value / 100);
  };
  const onChange = (value: number) => {
    setVolume(value);
    actions.previewVolume(track.trackId, value / 100);
  };

  return (
    <Tooltip text={t`Volume`}>
      <div className={styles.volumeControl}>
        <Volume1 size={16} />
        <Slider
          min={0}
          max={100}
          value={volume}
          onChange={onChange}
          onCommit={onComit}
        />
      </div>
    </Tooltip>
  );
}
