import { Trans } from "@lingui/react/macro";
import { Link } from "wouter";
import { BASE_URL } from "@/const";

import styles from "@/styles/BoardMissing.module.css";

export default function BoardMissing() {
  return (
    <div className={styles.missing}>
      <h1>
        <Trans>Board Not Found</Trans>
      </h1>
      <p>
        <Trans>The board you are looking for does not exist.</Trans>
      </p>
      <Link to={`${BASE_URL}/`}>
        <Trans>Back to Home</Trans>
      </Link>
    </div>
  );
}
