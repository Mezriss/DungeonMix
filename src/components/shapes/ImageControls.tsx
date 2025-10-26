import { useContext, useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { BoardStateContext } from "@/providers/BoardStateContext";

import type { Image as ImageType } from "@/state";
import type { ChangeEvent, PointerEvent } from "react";

import { ImageIcon, Move, Plus, Trash2 } from "lucide-react";
import styles from "@/styles/Image.module.css";

type Props = {
  image: ImageType;
  handleDragStart: (event: PointerEvent<HTMLButtonElement>) => void;
};

export default function ImageControls({ image, handleDragStart }: Props) {
  const state = useContext(BoardStateContext);

  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;

    const file = e.target.files[0];
    setLoading(true);
    await state.actions.loadImage(image.id, file);
    setLoading(false);
  };
  return (
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
  );
}
