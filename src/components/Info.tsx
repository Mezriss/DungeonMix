import Dialog from "./ui/Dialog";
import Tooltip from "./ui/Tooltip";

import { Info as InfoIcon } from "lucide-react";
import styles from "@/styles/Info.module.css";

export default function Info() {
  return (
    <>
      <Dialog
        trigger={
          <Tooltip text="Quick tips">
            <InfoIcon size={32} />
          </Tooltip>
        }
        title="Quick tips"
      >
        <div className={styles.info}>
          <p>
            This app is in a very early stage of development. Expect half of the
            functionality to be broken and the other half to be missing.
          </p>
          <h2 className={styles.subheader}>Controls</h2>
          <ul>
            <li>Left Click: Use the currently selected tool.</li>
            <li>Right Click: Deselect the current element.</li>
            <li>Middle Mouse (hold): Pan the board.</li>
            <li>Mouse Wheel: Zoom in and out.</li>
          </ul>
        </div>
      </Dialog>
    </>
  );
}
