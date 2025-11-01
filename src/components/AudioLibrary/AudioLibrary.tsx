import { Trans } from "@lingui/react/macro";
import { useContext } from "react";
import { useSnapshot } from "valtio";
import AudioGrabber from "./AudioGrabber";
import AudioList from "./AudioList";
import { BoardStateContext } from "@/providers/BoardStateContext";

import { Info } from "lucide-react";
import styles from "@/styles/AudioLibrary.module.css";

export default function AudioLibrary() {
  const state = useContext(BoardStateContext);
  const data = useSnapshot(state.data);
  const ui = useSnapshot(state.ui);

  if (!ui.editMode) return null;

  return (
    <div className={styles.library}>
      {data.folders.length ? (
        <AudioList />
      ) : (
        <div className="info">
          <Info /> <Trans>Start here</Trans>
        </div>
      )}
      <AudioGrabber />
    </div>
  );
}
