import { useContext } from "react";
import { useSnapshot } from "valtio";
import { Link } from "wouter";
import Info from "./Info";
import Settings from "./Settings";
import Switch from "./ui/Switch";
import { BoardStateContext } from "@/providers/BoardStateContext";

import styles from "@/styles/Header.module.css";

export default function Header() {
  const state = useContext(BoardStateContext);
  const data = useSnapshot(state.data);
  const ui = useSnapshot(state.ui);

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
              onChange={(e) => state.actions.updateName(e.target.value)}
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
            onChange={(checked) => state.actions.toggleEditMode(checked)}
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
