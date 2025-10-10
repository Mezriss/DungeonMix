import { Settings } from "lucide-react";
import { KEY_BOARDS } from "@/const";
import type { BoardList } from "@/Landing";
import { useBoardState } from "@/state";

import styles from "@/styles/Header.module.css";
import { Link } from "wouter";

export default function Header() {
  const { state, snap } = useBoardState();

  const updateBoardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.name = e.target.value;
    try {
      const boardIndex: BoardList = JSON.parse(
        localStorage.getItem(KEY_BOARDS) || "",
      );
      const record = boardIndex.find((board) => board.id === snap.id);
      if (record) {
        record.name = state.name;
        localStorage.setItem(KEY_BOARDS, JSON.stringify(boardIndex));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">DungeonMix</Link>
      </div>
      <div className={styles.name}>
        <input
          name="Board name"
          placeholder="Untitled board"
          value={snap.name}
          onChange={updateBoardName}
        />
      </div>
      <div className={styles.settings}>
        <Settings size={32} />
      </div>
    </div>
  );
}
