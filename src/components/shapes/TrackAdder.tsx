import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";

import styles from "@/styles/TrackAdder.module.css";
import { Combobox } from "@base-ui-components/react";

type Props = {
  children: React.ReactNode;
  areaId: string;
};

type Track = {
  name: string;
  path: string;
  folderId: string;
};

export default function TrackAdder({ children, areaId }: Props) {
  const { state, actions } = useBoardState();
  const [value, setValue] = useState<Track | null>(null);

  const tracks: Track[] = state.folders.flatMap((folder) =>
    folder.files.map((file) => ({
      name: file.name.replace(/\.[^.]+$/, ""),
      path: file.path,
      folderId: folder.id,
    })),
  );

  const handleChange = (track: Track | null) => {
    if (track) {
      actions.addTrackToArea(areaId, track.folderId, track.path);
    }
    console.info(areaId, track?.name, track?.path);
    setValue(null);
  };

  return (
    <Combobox.Root items={tracks} value={value} onValueChange={handleChange}>
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
              {(track: Track) => (
                <Combobox.Item
                  key={track.folderId + track.path}
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
