import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import Dialog from "./ui/Dialog";
import Tooltip from "./ui/Tooltip";
import { GITHUB_URL } from "@/const";

import { CircleQuestionMark } from "lucide-react";
import styles from "@/styles/Info.module.css";

export default function Info() {
  return (
    <>
      <Dialog
        trigger={
          <Tooltip text={t`Quick tips`}>
            <CircleQuestionMark size={32} />
          </Tooltip>
        }
        title={t`Quick tips`}
      >
        <div className={styles.info}>
          <p>
            <Trans>
              This app is still in development. There might be bugs or missing
              features. Suggestions? Bug reports? Get in touch on{" "}
              <a href={GITHUB_URL}>GitHub</a>.
            </Trans>
          </p>
          <h2 className={styles.subheader}>
            <Trans>Tools</Trans>
          </h2>
          <dl className={styles.definitions}>
            <dt>
              <Trans>Select</Trans>
            </dt>
            <dd>
              <Trans>
                Click to select audio area or an image. You will see a control
                panel in its center.
              </Trans>
            </dd>
            <dt>
              <Trans>Add sound area</Trans>
            </dt>
            <dd>
              <Trans>Drag to draw a rectangular or circular area.</Trans>
            </dd>
            <dt>
              <Trans>Add image</Trans>
            </dt>
            <dd>
              <Trans>
                Click to add an image placeholder. Then use appearing control
                panel to add image itself.
              </Trans>
            </dd>
          </dl>
          <h2 className={styles.subheader}>
            <Trans>Controls</Trans>
          </h2>
          <dl className={styles.definitions}>
            <dt>
              <Trans>Left Click</Trans>
            </dt>
            <dd>
              <Trans>Use the currently selected tool.</Trans>
            </dd>
            <dt>
              <Trans>Right Click</Trans>
            </dt>
            <dd>
              <Trans>Deselect the current element.</Trans>
            </dd>
            <dt>
              <Trans>Middle Mouse (hold)</Trans>
            </dt>
            <dd>
              <Trans>Pan the board.</Trans>
            </dd>
            <dt>
              <Trans>Mouse Wheel</Trans>
            </dt>
            <dd>
              <Trans>Zoom in and out.</Trans>
            </dd>
          </dl>
        </div>
      </Dialog>
    </>
  );
}
