import { useRef } from "react";
import AudioAreaComponent from "./shapes/AudioArea";
import { useBoardDimensions } from "@/hooks/boardCanvas/useBoardDimensions";
import { useBoardPan } from "@/hooks/boardCanvas/useBoardPan";
import { useShapeDrawing } from "@/hooks/boardCanvas/useShapeDrawing";
import { useZoom } from "@/hooks/boardCanvas/useZoom";
import { useBoardState } from "@/hooks/useBoardState";

import type { PointerEvent } from "react";

import { MapPin } from "lucide-react";
import styles from "@/styles/BoardCanvas.module.css";

export default function BoardCanvas() {
  const { data, ui, actions } = useBoardState();
  const divRef = useRef<HTMLDivElement>(null!);

  useZoom(divRef);
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
      } else if (!(e.target as HTMLElement).closest("button")) {
        actions.setMarker({
          x:
            (e.clientX - rect.x - rect.width / 2) * (1 / ui.zoom) -
            ui.position.x,
          y:
            (e.clientY - rect.y - rect.height / 2) * (1 / ui.zoom) -
            ui.position.y,
        });
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
          left: "50%",
          top: "50%",
          transform: `translate(${ui.position.x * ui.zoom + panDelta.x}px, ${ui.position.y * ui.zoom + panDelta.y}px)`,
        }}
      >
        {data.areas.map((area) => (
          <AudioAreaComponent key={area.id} area={area} />
        ))}
        {!ui.editMode && ui.marker && (
          <div
            className={styles.marker}
            style={{
              left: ui.marker.x * ui.zoom,
              top: ui.marker.y * ui.zoom,
            }}
          >
            <MapPin />
          </div>
        )}
      </div>
      {tempShape && <AudioAreaComponent area={tempShape} temp={true} />}
    </div>
  );
}
