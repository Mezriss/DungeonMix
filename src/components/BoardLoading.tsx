import { LoaderCircle } from "lucide-react";
import styles from "@/styles/BoardLoading.module.css";

export default function BoardLoading() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        <LoaderCircle />
      </div>
    </div>
  );
}
