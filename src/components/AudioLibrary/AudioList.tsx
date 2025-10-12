import { useBoardState } from "@/state";
import styles from "@/styles/AudioList.module.css";
import { Folder, FolderOpen, RefreshCw, X } from "lucide-react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import Tooltip from "@/components/ui/Tooltip";
import { AlertDialogTriggered as AlertDialog } from "../ui/AlertDialog";

export default function AudioList() {
  const { state, actions } = useBoardState();
  return (
    <div className={styles.audioList}>
      {state.folders.map((folder) => (
        <Collapsible.Root key={folder.id} className={styles.collapsible}>
          <div className={styles.collapsibleHeader}>
            <Collapsible.Trigger className={styles.trigger}>
              <Folder size={16} className={styles.iconClosed} />
              <FolderOpen size={16} className={styles.iconOpen} /> {folder.name}
            </Collapsible.Trigger>
            <Tooltip text="Refresh files in folder">
              <button
                className="button"
                onClick={() => actions.refreshFolder(folder.id)}
              >
                <RefreshCw size={16} />
              </button>
            </Tooltip>
            <Tooltip text="Remove folder">
              <AlertDialog
                title="Remove Folder"
                description="Are you sure you want to remove this folder? This will also remove its tracks from the board."
                actionName="Remove"
                action={() => actions.removeFolder(folder.id)}
              >
                <X size={16} />
              </AlertDialog>
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
