import { MapPin } from "lucide-react";
import { useRef } from "react";
import AudioAreaComponent from "./shapes/AudioArea";
import { useBoardDimensions } from "@/hooks/boardCanvas/useBoardDimensions";
import { useBoardPan } from "@/hooks/boardCanvas/useBoardPan";
import { useShapeDrawing } from "@/hooks/boardCanvas/useShapeDrawing";
import { useBoardState } from "@/hooks/useBoardState";

import type { PointerEvent } from "react";

import styles from "@/styles/BoardCanvas.module.css";

export default function BoardCanvas() {
  const { data, ui, actions } = useBoardState();
  const divRef = useRef<HTMLDivElement>(null!);

  const rect = useBoardDimensions(divRef);

  const { tempShape, startDrawing, draw, endDrawing } = useShapeDrawing({
    rect,
  });
  const { panDelta, startPan, pan, endPan } = useBoardPan();

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const editMode = actions.getUI("editMode");
    const selectedTool = actions.getUI("selectedTool");

    startPan(e);
    startDrawing(e);

    if (e.buttons === 1) {
      if (editMode) {
        if (selectedTool === "select" && e.target === e.currentTarget) {
          actions.selectArea(null);
        }
      } else {
        actions.setMarker(e.clientX - rect.x, e.clientY - rect.y);
      }
    }
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    endDrawing();
    endPan(e);
  }

  function handlePointerLeave(e: PointerEvent<HTMLDivElement>) {
    endPan(e);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    draw(e);
    pan(e);
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
          transform: `translate(${ui.position.x + panDelta.x}px, ${ui.position.y + panDelta.y}px)`,
        }}
      >
        {data.areas.map((area) => (
          <AudioAreaComponent key={area.id} area={area} />
        ))}
        {!ui.editMode && ui.marker && (
          <div
            className={styles.marker}
            style={{ left: ui.marker.x, top: ui.marker.y }}
          >
            <MapPin />
          </div>
        )}
      </div>
      {tempShape && <AudioAreaComponent area={tempShape} temp={true} />}
    </div>
  );
}
