import styles from "@/styles/AudioLibrary.module.css";
import { Info } from "lucide-react";
import AudioGrabber from "./AudioGrabber";
import { useBoardState } from "@/state";
import AudioList from "./AudioList";

export default function AudioLibrary() {
  const { state } = useBoardState();

  return (
    <div className={styles.library}>
      {state.folders.length ? (
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
