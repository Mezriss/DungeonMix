import { Trans } from "@lingui/react/macro";
import { Link } from "wouter";
import { BASE_URL } from "@/const";

import { Bug } from "lucide-react";
import styles from "@/styles/BoardError.module.css";

export default function BoardError({ error }: { error: Error }) {
  return (
    <div className={styles.errored}>
      <h1>
        <Trans>Something went wrong</Trans>
      </h1>
      <div className={styles.message}>
        <Bug />
        <div className={styles.separator}></div>
        <div>{error.message}</div>
      </div>
      <div>
        <Trans>
          But there is still hope - try{" "}
          <Link href={`${BASE_URL}/`}>returning to title</Link> and loading your
          board again
        </Trans>
      </div>
    </div>
  );
}
