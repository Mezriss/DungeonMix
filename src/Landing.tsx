import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { nanoid } from "nanoid";
import { KEY_BOARDS, STORE_PREFIX } from "./const";
import { getInitialBoardState } from "./state";

import styles from "@/styles/Landing.module.css";

export type BoardList = {
  id: string;
  name: string;
}[];

export default function Landing() {
  const [, navigate] = useLocation();
  const [boards, setBoards] = useState<BoardList | null>(null);
  useEffect(() => {
    try {
      setBoards(JSON.parse(localStorage.getItem(KEY_BOARDS) || "[]"));
    } catch (error) {
      console.error(error);
    }
  }, []);

  function createBoard() {
    const id = nanoid();
    localStorage.setItem(
      KEY_BOARDS,
      JSON.stringify([...(boards || []), { id, name: "Untitled Board" }]),
    );
    localStorage.setItem(
      STORE_PREFIX + id,
      JSON.stringify(getInitialBoardState(id)),
    );
    navigate(`/boards/${id}`);
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
          <>
            <button onClick={createBoard} className="button">
              Create New Board
            </button>
            {!boards?.length ? null : (
              <>
                <div>or load existing board</div>
                <ul>
                  {boards.map((board) => (
                    <li key={board.id}>
                      <Link href={`/boards/${board.id}`}>
                        {board.name || "Untitled Board"}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
