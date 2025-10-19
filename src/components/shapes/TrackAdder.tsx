import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import styles from "@/styles/TrackAdder.module.css";
import { Combobox } from "@base-ui-components/react";
import type { FileInfo } from "@/state";

type Props = {
  children: React.ReactNode;
  areaId: string;
};

export default function TrackAdder({ children, areaId }: Props) {
  const { state, actions } = useBoardState();
  const [value, setValue] = useState<FileInfo | null>(null);

  const tracks = Object.values(state.files).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const handleChange = (track: FileInfo | null) => {
    if (track) {
      actions.addTrackToArea(areaId, track.id);
    }
    setValue(null);
  };

  return (
    <Combobox.Root
      items={tracks}
      value={value}
      onValueChange={handleChange}
      filter={(item: FileInfo, query: string) => {
        if (!query) return true;
        return item.name.toLowerCase().includes(query.toLowerCase());
      }}
    >
      <Combobox.Trigger render={<div />} nativeButton={false}>
        {children}
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner align="start" sideOffset={4}>
          <Combobox.Popup className={styles.popup} aria-label="Select track">
            <div className={styles.inputContainer}>
              <Combobox.Input
                placeholder={"e.g. " + tracks[0].name}
                className={styles.input}
              />
            </div>
            <Combobox.Empty className={styles.empty}>
              No tracks found.
            </Combobox.Empty>
            <Combobox.List className={styles.list}>
              {(track: FileInfo) => (
                <Combobox.Item
                  key={track.id}
                  value={track}
                  className={styles.item}
                >
                  {/* TODO: show file path */}
                  <div className={styles.itemText}>{track.name}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
