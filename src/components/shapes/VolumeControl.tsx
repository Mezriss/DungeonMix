import { Slider } from "@base-ui-components/react/slider";
import { useEffect, useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";

import type { Track } from "@/state";

import { Volume1 } from "lucide-react";
import styles from "@/styles/VolumeControl.module.css";

type Props = {
  areaId: string;
  track: Track;
};

export default function VolumeControl({ areaId, track }: Props) {
  const { actions } = useBoardState();
  const [volume, setVolume] = useState(track.volume * 100);
  useEffect(() => {
    setVolume(track.volume * 100);
  }, [track.volume]);
  const onValueComitted = (value: number) => {
    actions.setTrackVolume(areaId, track.trackId, value / 100);
  };
  const onValueChange = (value: number) => {
    setVolume(value);
    actions.previewVolume(track.trackId, value / 100);
  };

  return (
    <Tooltip text="Volume">
      <div className={styles.volumeControl}>
        <Volume1 size={16} />
        <Slider.Root
          value={volume}
          min={0}
          max={100}
          onValueChange={onValueChange}
          onValueCommitted={onValueComitted}
        >
          <Slider.Control className={styles.control}>
            <Slider.Track className={styles.track}>
              <Slider.Indicator className={styles.indicator} />
              <Slider.Thumb className={styles.thumb} />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>
    </Tooltip>
  );
}
