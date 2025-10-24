import { Collapsible } from "@base-ui-components/react/collapsible";
import { useMemo } from "react";
import { AlertDialogTriggered as AlertDialog } from "@/components/ui/AlertDialog";
import Tooltip from "@/components/ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";
import { classes } from "@/util/misc";

import { Folder, FolderOpen, RefreshCw, X } from "lucide-react";
import styles from "@/styles/AudioList.module.css";

export default function AudioList() {
  const { data, actions } = useBoardState();
  return (
    <div className={classes(styles.audioList, "panel")}>
      {data.folders.map((folder) => (
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
          <TrackList folderId={folder.id} />
        </Collapsible.Root>
      ))}
    </div>
  );
}

function TrackList({ folderId }: { folderId: string }) {
  const { data } = useBoardState();

  const list = useMemo(() => {
    return Object.values(data.files)
      .filter((file) => file.folderId === folderId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data.files, folderId]);

  return (
    <Collapsible.Panel className={styles.panel}>
      <div className={styles.content}>
        {list.map((file) => (
          <div key={file.id}>{file.name}</div>
        ))}
      </div>
    </Collapsible.Panel>
  );
}
