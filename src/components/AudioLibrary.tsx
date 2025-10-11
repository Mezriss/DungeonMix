import styles from "@/styles/AudioLibrary.module.css";
import { Info } from "lucide-react";
import AudioGrabber from "./AudioLibrary/AudioGrabber";
import { useBoardState } from "@/state";

export default function AudioLibrary() {
  const { snap } = useBoardState();

  return (
    <div className={styles.library}>
      {!snap.folders.length && (
        <div className="info">
          <Info /> Start here
        </div>
      )}
      <AudioGrabber />
    </div>
  );
}
