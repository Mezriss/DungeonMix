import { useBoardState } from "@/state";
import styles from "@/styles/AudioList.module.css";
import { Folder, FolderOpen, RefreshCw, X } from "lucide-react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import Tooltip from "@/components/ui/Tooltip";

export default function AudioList() {
  const { snap } = useBoardState();
  return (
    <div className={styles.audioList}>
      {snap.folders.map((folder) => (
        <Collapsible.Root key={folder.id} className={styles.collapsible}>
          <div className={styles.collapsibleHeader}>
            <Collapsible.Trigger className={styles.trigger}>
              <Folder size={16} className={styles.iconClosed} />
              <FolderOpen size={16} className={styles.iconOpen} /> {folder.name}
            </Collapsible.Trigger>
            <Tooltip text="Refresh files in folder">
              <RefreshCw size={16} />
            </Tooltip>
            <Tooltip text="Remove folder">
              <X size={16} />
            </Tooltip>
          </div>
          <Collapsible.Panel className={styles.panel}>
            <div className={styles.content}>
              {folder.files.map((file) => (
                <div key={file.path}>{file.name.replace(/\.[^.]+$/, "")}</div>
              ))}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      ))}
    </div>
  );
}
