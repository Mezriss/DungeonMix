import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

import styles from "@/styles/Locator.module.css";

export default function Locator() {
  const { ui } = useBoardState();
  return (
    <div className={classes(styles.locator, "panel")}>
      <div className={styles.position}>
        <div className={styles.indicator}>
          X:<div className={styles.value}>{Math.round(ui.position.x)}</div>
        </div>
        <div className={styles.sep} />
        <div className={styles.indicator}>
          Y:<div className={styles.value}>{Math.round(ui.position.y)}</div>
        </div>
      </div>
    </div>
  );
}
