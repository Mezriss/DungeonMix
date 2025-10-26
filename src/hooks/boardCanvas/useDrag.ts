import { useContext, useState } from "react";
import { BoardStateContext } from "@/providers/BoardStateContext";

type Props = {
  onDragEnd: (moveX: number, moveY: number) => void;
};

export function useDrag({ onDragEnd }: Props) {
  const state = useContext(BoardStateContext);
  const [move, setMove] = useState<[number, number] | null>(null);
  const [offset, setOffset] = useState<[number, number] | null>(null);

  const handleDragStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    setMove([e.clientX, e.clientY]);
  };

  const handleDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!move) return;

    const dx = e.clientX - move[0];
    const dy = e.clientY - move[1];
    setOffset([dx, dy]);
  };

  const handleDragEnd = () => {
    if (offset) {
      onDragEnd(
        offset[0] * (1 / state.ui.zoom),
        offset[1] * (1 / state.ui.zoom),
      );
    }
    setMove(null);
    setOffset(null);
  };

  return {
    offset,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
}
