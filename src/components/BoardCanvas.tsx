import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AudioAreaComponent from "./shapes/AudioArea";
import { useBoardState } from "@/hooks/useBoardState";

import type { AudioArea } from "@/state";

import styles from "@/styles/BoardCanvas.module.css";

export default function BoardCanvas() {
  const { data, ui, actions } = useBoardState();
  const divRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [mode, setMode] = useState<"add" | "drag" | null>(null);
  const [tempShape, setTempShape] = useState<AudioArea>({
    id: "temp",
    shape: "rectangle",
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    tracks: [],
  });
  const dragStartCoords = useRef({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (divRef.current) {
        setRect(divRef.current.getBoundingClientRect());
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const [editMode, selectedTool] = actions.getUI("editMode", "selectedTool");
    if (editMode && e.buttons === 1 && e.target !== e.currentTarget) {
      return;
    }
    e.preventDefault();
    if (e.buttons === 4) {
      setMode("drag");
      dragStartCoords.current = { x: e.clientX, y: e.clientY };
    }

    if (e.buttons === 1 && !editMode) {
      actions.setMarker(e.clientX - rect.x, e.clientY - rect.y);
    }

    if (e.buttons === 1 && editMode) {
      if (selectedTool === "select") {
        actions.selectArea(null);
      }
      if (selectedTool === "rectangle" || selectedTool === "circle") {
        setMode("add");
        setTempShape({
          id: "temp",
          shape: selectedTool,
          width: 0,
          height: 0,
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
          tracks: [],
        });
      }
    }
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode === "drag") {
      actions.moveBoard(
        e.clientX - dragStartCoords.current.x,
        e.clientY - dragStartCoords.current.y,
      );
      setDragDelta({ x: 0, y: 0 });
    }
  };

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (mode === "add") {
      actions.addArea(tempShape);
    }
    endDrag(e);
    setMode(null);
  }

  function handlePointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    endDrag(e);
    setMode(null);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (mode === "add") {
      setTempShape({
        ...tempShape,
        width: e.clientX - rect.x - tempShape.x,
        height: e.clientY - rect.y - tempShape.y,
      });
    }
    if (mode === "drag") {
      setDragDelta({
        x: e.clientX - dragStartCoords.current.x,
        y: e.clientY - dragStartCoords.current.y,
      });
    }
  }

  return (
    <div
      ref={divRef}
      className={styles.body}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className={styles.positioner}
        style={{
          transform: `translate(${ui.position.x + dragDelta.x}px, ${ui.position.y + dragDelta.y}px)`,
        }}
      >
        {data.areas.map((area) => (
          <AudioAreaComponent key={area.id} area={area} />
        ))}
      </div>
      {mode === "add" && <AudioAreaComponent area={tempShape} temp={true} />}
      {!ui.editMode && ui.marker && (
        <div
          className={styles.marker}
          style={{ left: ui.marker.x, top: ui.marker.y }}
        >
          <MapPin />
        </div>
      )}
    </div>
  );
}
