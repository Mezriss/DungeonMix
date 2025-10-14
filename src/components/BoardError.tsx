import styles from "@/styles/BoardError.module.css";
import { Bug } from "lucide-react";
import { Link } from "wouter";

export default function BoardError({ error }: { error: Error }) {
  return (
    <div className={styles.errored}>
      <h1>Something went wrong</h1>
      <div className={styles.message}>
        <Bug />
        <div className={styles.separator}></div>
        <div>{error.message}</div>
      </div>
      <div>
        But there is still hope - try <Link to="/">returning to title</Link> and
        loading your board again
      </div>
    </div>
  );
}
