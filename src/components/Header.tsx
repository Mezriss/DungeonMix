import { useCallback, useState } from "react";
import { Link, useLocation } from "wouter";
import Switch from "./ui/Switch";
import { AlertDialog } from "@/components/ui/AlertDialog";
import Menu from "@/components/ui/Menu";
import { useBoardState } from "@/hooks/useBoardState";

import { Settings } from "lucide-react";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { data, ui, actions } = useBoardState();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteBoard = useCallback(() => {
    try {
      actions.deleteBoard();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }, [actions, navigate]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">DungeonMix</Link>
        </div>
        <div className={styles.name}>
          {ui.editMode ? (
            <input
              name="Board name"
              placeholder="Untitled board"
              value={data.name}
              onChange={(e) => actions.updateName(e.target.value)}
            />
          ) : (
            <h2>{data.name || "Untitled board"}</h2>
          )}
        </div>
        <div className={styles.editToggle}>
          <div>
            Edit
            <br />
            Mode
          </div>
          <Switch
            checked={ui.editMode}
            onChange={(checked) => actions.toggleEditMode(checked)}
          />
        </div>
        <div className={styles.settings}>
          <Menu
            trigger={<Settings size={32} />}
            items={[
              { name: "Delete Board", onClick: () => setIsDialogOpen(true) },
            ]}
          />
        </div>
      </div>
      <AlertDialog
        title="Delete Board"
        description="Delete this board? This can't be undone."
        actionName="Delete"
        action={deleteBoard}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
      />
    </>
  );
}
