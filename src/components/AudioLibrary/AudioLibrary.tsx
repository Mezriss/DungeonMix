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

  return (
    <div className={styles.library}>
      {data.folders.length ? (
        <AudioList />
      ) : (
        <div className="info">
          <Info /> Start here
        </div>
      )}
      <AudioGrabber />
    </div>
  );
}
