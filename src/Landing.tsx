import { useState } from "react";
import { Link } from "wouter";
import { useIDB } from "./hooks/useIDB";
import { IDB_PREFIX } from "./const";

import styles from "@/styles/Landing.module.css";

type BoardList = {
  id: string;
  name: string;
}[];

export default function Landing() {
  const [creating, setCreating] = useState(false);
  const { data: boards, loading } = useIDB<BoardList>(IDB_PREFIX + "boards");

  function createBoard() {
    setCreating(true);
    // ...
  }

  return (
    <div className={styles.landing}>
      <div>
        <div className={styles.title}>
          <h1>
            Welcome to <span>DungeonMix</span>
          </h1>
          <p>
            DungeonMix is a web application that allows you to create audio
            boards for your dungeon maps.
          </p>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.controls}>
          {!loading && (
            <>
              <button disabled={creating} onClick={createBoard}>
                Create New Board
              </button>
              {boards?.length && (
                <>
                  <div>or load existing board</div>
                  <ul>
                    {boards.map((board) => (
                      <li key={board.id}>
                        <Link href={`/boards/${board.id}`}>{board.name}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
