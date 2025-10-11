import { subscribe } from "valtio";
import MissingBoard from "./components/MissingBoard";
import { initBoardState, BoardStateContext, type State } from "./state";
import { useEffect, useState } from "react";
import { STORE_PREFIX } from "./const";
import Header from "./components/Header";

export default function Board({ id }: { id: string }) {
  const [state, setState] = useState<State | null | undefined>(undefined);
  useEffect(() => {
    const boardState = initBoardState(id);
    setState(boardState);

    const unsubscribe = boardState
      ? subscribe(boardState, () => {
          localStorage.setItem(STORE_PREFIX + id, JSON.stringify(boardState));
        })
      : undefined;

    return () => {
      unsubscribe?.();
    };
  }, [id]);

  if (state === undefined) return null;
  if (state === null) return <MissingBoard />;

  return (
    <BoardStateContext.Provider value={state}>
      <Header />
    </BoardStateContext.Provider>
  );
}
