import { ErrorBoundary } from "react-error-boundary";
import BoardMissing from "./components/BoardMissing";
import Header from "./components/Header";
import AudioLibrary from "./components/AudioLibrary/AudioLibrary";
import Toolbar from "./components/Toolbar";
import BoardCanvas from "./components/BoardCanvas";
import { BoardStateContext } from "./providers/BoardStateContext";
import BoardError from "./components/BoardError";
import { useStoredState } from "./hooks/useStoredState";
import styles from "./styles/Board.module.css";

export default function Board({ id }: { id: string }) {
  const { state, isNotFound } = useStoredState(id);

  if (isNotFound) return <BoardMissing />;

  if (state)
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

  return null;
}
