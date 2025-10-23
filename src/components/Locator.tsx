import { useEffect, useId, useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

import type { KeyboardEvent } from "react";

import { Minus, Plus } from "lucide-react";
import styles from "@/styles/Locator.module.css";

export default function Locator() {
  const { ui, actions } = useBoardState();
  const [zoom, setZoom] = useState(Math.round(ui.zoom * 100) + "%");
  const id = useId();

  useEffect(() => {
    setZoom(Math.round(ui.zoom * 100) + "%");
  }, [ui.zoom]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        actions.changeZoom(0.1);
        break;
      case "ArrowDown":
        actions.changeZoom(-0.1);
        break;
      case "Enter": {
        const value = parseInt(
          event.currentTarget.value.replace(/[^0-9]/g, ""),
          10,
        );
        actions.setZoom(isNaN(value) ? 1 : value / 100);
        break;
      }
    }
  };

  return (
    <div className={classes(styles.locator, "panel")}>
      <div className={styles.position}>
        <div className={styles.indicator}>
          X:<div className={styles.value}>{-Math.round(ui.position.x)}</div>
        </div>
        <div className={styles.indicator}>
          Y:<div className={styles.value}>{-Math.round(ui.position.y)}</div>
        </div>
      </div>
      <label htmlFor={id}>Z:</label>

      <div className={styles.zoom}>
        <input
          id={id}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className={"button"} onClick={() => actions.changeZoom(0.1)}>
          <Plus size={16} />
        </button>
        <button className={"button"} onClick={() => actions.changeZoom(-0.1)}>
          <Minus size={16} />
        </button>
      </div>
    </div>
  );
}
