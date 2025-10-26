import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSnapshot } from "valtio";
import ImageControls from "./ImageControls";
import { STORE_PREFIX } from "@/const";
import { useDrag } from "@/hooks/boardCanvas/useDrag";
import { useIDB } from "@/hooks/useIDB";
import { BoardStateContext } from "@/providers/BoardStateContext";
import { classes } from "@/util/misc";

import type { Image as ImageType } from "@/state";
import type { CSSProperties } from "react";

import { ImageOff } from "lucide-react";
import styles from "@/styles/Image.module.css";

type Props = {
  image: ImageType;
  rect: { x: number; y: number; width: number; height: number };
};

export default function ImageContainer({ image, rect }: Props) {
  const state = useContext(BoardStateContext);
  const { selectedId, zoom, position } = useSnapshot(state.ui);
  const selected = image.id === selectedId;

  const style = {
    "--scale": zoom,
  } as CSSProperties;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      e.buttons === 1 &&
      state.ui.editMode &&
      state.ui.selectedTool === "select"
    ) {
      state.actions.select(image.id);
    }
  };

  const { offset, handleDragStart, handleDrag, handleDragEnd } = useDrag({
    onDragEnd: (moveX, moveY) => {
      state.actions.moveImage(image.id, moveX, moveY);
    },
  });

  const absoluteAreaCenter = {
    x: rect.x + rect.width / 2 + position.x + image.x * zoom,
    y: rect.y + rect.height / 2 + position.y + image.y * zoom,
  };
  if (offset) {
    absoluteAreaCenter.x += offset[0];
    absoluteAreaCenter.y += offset[1];
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handleDrag}
      onPointerUp={handleDragEnd}
      onPointerLeave={handleDragEnd}
      className={classes(styles.imageContainer, selected && styles.selected)}
      style={{
        top: image.y,
        left: image.x,
        ...(offset && {
          transform: `translate(calc(-50% + ${offset[0] * (1 / zoom)}px), calc(-50% + ${offset[1] * (1 / zoom)}px))`,
        }),
        ...style,
      }}
    >
      {image.assetId ? (
        <Image assetId={image.assetId} />
      ) : (
        <div className={styles.noImage}>
          <ImageOff size={64} />
        </div>
      )}
      {selected &&
        createPortal(
          <div
            className={classes(styles.controlsPanel, "panel")}
            style={{
              left: absoluteAreaCenter.x,
              top: absoluteAreaCenter.y,
            }}
          >
            <ImageControls image={image} handleDragStart={handleDragStart} />
          </div>,
          document.body,
        )}
    </div>
  );
}

function Image({ assetId }: { assetId: string }) {
  const { data, error, loading } = useIDB<File>(STORE_PREFIX + assetId);
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!data) return;
    const blob = new Blob([data], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    setSrc(url);
  }, [data]);

  if (error) {
    return <div>Error loading image</div>;
  }

  if (loading) {
    return <div>Loading image...</div>;
  }

  return <>{src && <img src={src} alt="Image" />}</>;
}
