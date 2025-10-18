import { useCallback, useState } from "react";
import { Link, useLocation } from "wouter";
import { Settings } from "lucide-react";
import { AlertDialog } from "@/components/ui/AlertDialog";
import Menu from "@/components/ui/Menu";
import { useBoardState } from "@/hooks/useBoardState";
import Switch from "./ui/Switch";

import styles from "@/styles/Header.module.css";

export default function Header() {
  const { state, ui, actions } = useBoardState();
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
          <input
            name="Board name"
            placeholder="Untitled board"
            value={state.name}
            onChange={(e) => actions.updateName(e.target.value)}
          />
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
