import styles from "@/styles/Landing.module.css";

export default function Landing() {
  return (
    <div className={styles.landing}>
      <div>
        <div className={styles.title}>
          <h1>
            Welcome to <span>DungeonMix</span>
          </h1>
          <p>
            DungeonMix is a web application that allows you to create and share
            audio boards for your dungeon maps.
          </p>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.controls}>
          <button>Create New Board</button>
          <div>or load existing board</div>
          <ul>
            <li>
              <a href="#">Unnamed board 1</a>
            </li>
            <li>
              <a href="#">Unnamed board 1</a>
            </li>
            <li>
              <a href="#">Unnamed board 1</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
