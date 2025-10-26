import { useContext, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import Tooltip from "../ui/Tooltip";
import { STORE_PREFIX } from "@/const";
import { useDrag } from "@/hooks/boardCanvas/useDrag";
import { useIDB } from "@/hooks/useIDB";
import { BoardStateContext } from "@/providers/BoardStateContext";
import { classes } from "@/util/misc";

import type { Image as ImageType } from "@/state";
import type { ChangeEvent, CSSProperties } from "react";

import { Image as ImageIcon, ImageOff, Move, Plus, Trash2 } from "lucide-react";
import styles from "@/styles/Image.module.css";

type Props = {
  image: ImageType;
};

export default function ImageContainer({ image }: Props) {
  const state = useContext(BoardStateContext);
  const ui = useSnapshot(state.ui);
  const selected = image.id === ui.selectedId;
  const [loading, setLoading] = useState(false);

  const style = {
    "--scale": ui.zoom,
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;

    const file = e.target.files[0];
    setLoading(true);
    await state.actions.loadImage(image.id, file);
    setLoading(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handleDrag}
      onPointerUp={handleDragEnd}
      onPointerLeave={handleDragEnd}
      className={classes(styles.imageContainer, selected && styles.selected)}
      style={{
        top: image.y * ui.zoom,
        left: image.x * ui.zoom,
        ...(offset && {
          transform: `translate(calc(-50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))`,
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
      {selected && (
        <div className={styles.controls}>
          {!image.assetId && (
            <Tooltip text="Add image">
              <label className={"button"}>
                <input
                  disabled={loading}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Plus size={16} />
                <ImageIcon size={16} />
              </label>
            </Tooltip>
          )}
          <Tooltip text="Hold button to move image">
            <button className={"button"} onPointerDown={handleDragStart}>
              <Move size={16} />
            </button>
          </Tooltip>
          <Tooltip text="Delete image">
            <button
              className={"button"}
              onClick={() => state.actions.deleteImage(image.id)}
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

function Image({ assetId }: { assetId: string }) {
  const state = useContext(BoardStateContext);
  const ui = useSnapshot(state.ui);
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

  return (
    <>
      {src && (
        <img
          src={src}
          alt="Image"
          style={{
            zoom: ui.zoom,
          }}
        />
      )}
    </>
  );
}
