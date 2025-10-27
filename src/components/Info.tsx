import Dialog from "./ui/Dialog";
import Tooltip from "./ui/Tooltip";

import { CircleQuestionMark } from "lucide-react";
import styles from "@/styles/Info.module.css";

export default function Info() {
  return (
    <>
      <Dialog
        trigger={
          <Tooltip text="Quick tips">
            <CircleQuestionMark size={32} />
          </Tooltip>
        }
        title="Quick tips"
      >
        <div className={styles.info}>
          <p>
            This app is in a very early stage of development. Expect half of the
            functionality to be broken and the other half to be missing.
          </p>
          <h2 className={styles.subheader}>Tools</h2>
          <dl className={styles.definitions}>
            <dt>Select</dt>
            <dd>
              Click to select audio area or an image. You will see a control
              panel in its center.
            </dd>
            <dt>Add sound area</dt>
            <dd>Drag to draw a rectangular or circular area.</dd>
            <dt>Add image</dt>
            <dd>
              Click to add an image placeholder. Then use appearing control
              panel to add image itself.
            </dd>
          </dl>
          <h2 className={styles.subheader}>Controls</h2>
          <dl className={styles.definitions}>
            <dt>Left Click</dt>
            <dd>Use the currently selected tool.</dd>
            <dt>Right Click</dt>
            <dd>Deselect the current element.</dd>
            <dt>Middle Mouse (hold)</dt>
            <dd>Pan the board.</dd>
            <dt>Mouse Wheel</dt>
            <dd>Zoom in and out.</dd>
          </dl>
        </div>
      </Dialog>
    </>
  );
}
