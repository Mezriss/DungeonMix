import { Link } from "wouter";

import styles from "@/styles/BoardMissing.module.css";

export default function BoardMissing() {
  return (
    <div className={styles.missing}>
      <h1>Board Not Found</h1>
      <p>The board you are looking for does not exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
