import type { AudioArea } from "@/state";

import styles from "@/styles/AudioArea.module.css";
import { classes } from "@/util/misc";

export default function AudioAreaComponent({
  area,
  temp = false,
  selected = false,
}: {
  area: AudioArea;
  temp?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      className={classes(
        styles.area,
        area.shape === "rectangle" ? styles.rectangle : styles.circle,
      )}
      style={{
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
      }}
    >
      {selected && <div>controls</div>}
      {!temp && <div>info</div>}
    </div>
  );
}
