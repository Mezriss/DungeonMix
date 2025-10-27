import { useContext } from "react";
import { useSnapshot } from "valtio";
import Tooltip from "./ui/Tooltip";
import { BoardStateContext } from "@/providers/BoardStateContext";
import { classes } from "@/util/misc";

import {
  Circle,
  Image,
  MapPin,
  MousePointer2,
  Music,
  Square,
} from "lucide-react";
import styles from "@/styles/Toolbar.module.css";

export default function Toolbar() {
  const state = useContext(BoardStateContext);
  const ui = useSnapshot(state.ui);
  if (!ui.editMode)
    return (
      <div className={classes(styles.toolbar, "panel")}>
        <Tooltip text="Place location marker" side="right">
          <button className={classes("button", styles.selected)}>
            <MapPin size={16} />
          </button>
        </Tooltip>
      </div>
    );
  return (
    <div className={classes(styles.toolbar, "panel")}>
      <Tooltip text="Select" side="right">
        <button
          onClick={() => state.actions.switchTool("select")}
          className={classes(
            "button",
            ui.selectedTool === "select" && styles.selected,
          )}
        >
          <MousePointer2 size={16} />
        </button>
      </Tooltip>
      <div className={styles.separator} />
      <Music size={16} />
      <Tooltip text="Add rectangular sound area" side="right">
        <button
          onClick={() => state.actions.switchTool("rectangle")}
          className={classes(
            "button",
            ui.selectedTool === "rectangle" && styles.selected,
          )}
        >
          <Square size={16} />
        </button>
      </Tooltip>
      <Tooltip text="Add circular sound area" side="right">
        <button
          onClick={() => state.actions.switchTool("circle")}
          className={classes(
            "button",
            ui.selectedTool === "circle" && styles.selected,
          )}
        >
          <Circle size={16} />
        </button>
      </Tooltip>
      <div className={styles.separator} />

      <Tooltip text="Add image">
        <button
          onClick={() => state.actions.switchTool("image")}
          className={classes(
            "button",
            ui.selectedTool === "image" && styles.selected,
          )}
        >
          <Image size={16} />
        </button>
      </Tooltip>
    </div>
  );
}
