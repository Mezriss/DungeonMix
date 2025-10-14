import { useEffect, useState } from "react";
import { subscribe } from "valtio";
import { ErrorBoundary } from "react-error-boundary";
import BoardMissing from "./components/BoardMissing";
import { initBoardState, type State } from "./state";
import { STORE_PREFIX } from "./const";
import Header from "./components/Header";
import AudioLibrary from "./components/AudioLibrary/AudioLibrary";
import Toolbar from "./components/Toolbar";
import BoardCanvas from "./components/BoardCanvas";

import styles from "./styles/Board.module.css";
import { BoardStateContext } from "./providers/BoardStateContext";
import BoardError from "./components/BoardError";

export default function Board({ id }: { id: string }) {
  const [state, setState] = useState<State | null | undefined>(undefined);
  useEffect(() => {
    const boardState = initBoardState(id);
    setState(boardState);

    const unsubscribe = boardState
      ? subscribe(boardState.data, () => {
          localStorage.setItem(
            STORE_PREFIX + id,
            JSON.stringify(boardState.data),
          );
        })
      : undefined;

    return () => {
      unsubscribe?.();
    };
  }, [id]);

  if (state === undefined) return null;
  if (state === null) return <BoardMissing />;

  return (
    <BoardStateContext.Provider value={state}>
      <ErrorBoundary FallbackComponent={BoardError}>
        <div className={styles.board}>
          <Header />
          <BoardCanvas />
        </div>
        <Toolbar />
        <AudioLibrary />
      </ErrorBoundary>
    </BoardStateContext.Provider>
  );
}
