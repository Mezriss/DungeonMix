import styles from "@/styles/AudioLibrary.module.css";
import { Info } from "lucide-react";
import AudioGrabber from "./AudioGrabber";
import { useBoardState } from "@/hooks/useBoardState";
import AudioList from "./AudioList";

export default function AudioLibrary() {
  const { data } = useBoardState();

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
