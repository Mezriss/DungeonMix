import { Link } from "wouter";
import Info from "./Info";
import Settings from "./Settings";
import Switch from "./ui/Switch";
import { useBoardState } from "@/hooks/useBoardState";

import styles from "@/styles/Header.module.css";

export default function Header() {
  const { data, ui, actions } = useBoardState();

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">DungeonMix</Link>
        </div>
        <div className={styles.name}>
          {ui.editMode ? (
            <input
              name="Board name"
              placeholder="Untitled board"
              value={data.name}
              onChange={(e) => actions.updateName(e.target.value)}
            />
          ) : (
            <h2>{data.name || "Untitled board"}</h2>
          )}
        </div>
        <div className={styles.editToggle}>
          <div>
            Edit
            <br />
            Mode
          </div>
          <Switch
            checked={ui.editMode}
            onChange={(checked) => actions.toggleEditMode(checked)}
          />
        </div>
        <div className={styles.headerButton}>
          <Info />
        </div>
        <div className={styles.headerButton}>
          <Settings />
        </div>
      </div>
    </>
  );
}
