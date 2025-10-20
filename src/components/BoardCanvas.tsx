import { useEffect, useRef, useState } from "react";
import styles from "@/styles/BoardCanvas.module.css";
import { useBoardState } from "@/hooks/useBoardState";
import AudioAreaComponent from "./shapes/AudioArea";
import type { AudioArea } from "@/state";
import { MapPin } from "lucide-react";

export default function BoardCanvas() {
  const { state, ui, actions } = useBoardState();
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
    if (editMode && e.target !== e.currentTarget) {
      return;
    }
    e.preventDefault();
    if (e.buttons === 4) {
      setMode("drag");
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

  function handlePointerUp() {
    if (mode === "add") {
      actions.addArea(tempShape);
    }
    setMode(null);
  }

  function handlePointerLeave() {
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
      {state.areas.map((area) => (
        <AudioAreaComponent key={area.id} area={area} />
      ))}
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
