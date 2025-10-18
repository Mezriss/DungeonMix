import { Circle, MapPin, MousePointer2, Music, Square } from "lucide-react";
import styles from "@/styles/Toolbar.module.css";
import Tooltip from "./ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

export default function Toolbar() {
  const { ui, actions } = useBoardState();
  if (!ui.editMode)
    return (
      <div className={styles.toolbar}>
        <Tooltip text="Place location marker" side="right">
          <button className={classes("button", styles.selected)}>
            <MapPin size={16} />
          </button>
        </Tooltip>
      </div>
    );
  return (
    <div className={styles.toolbar}>
      <Tooltip text="Select" side="right">
        <button
          onClick={() => actions.switchTool("select")}
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
          onClick={() => actions.switchTool("rectangle")}
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
          onClick={() => actions.switchTool("circle")}
          className={classes(
            "button",
            ui.selectedTool === "circle" && styles.selected,
          )}
        >
          <Circle size={16} />
        </button>
      </Tooltip>
    </div>
  );
}
