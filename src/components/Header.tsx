import { useCallback, useState } from "react";
import { Settings } from "lucide-react";
import { Menu } from "@base-ui-components/react/menu";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { useBoardState } from "@/state";

import styles from "@/styles/Header.module.css";
import { Link, useLocation } from "wouter";
import ArrowSvg from "@/assets/ArrowSvg";

export default function Header() {
  const { snap, actions } = useBoardState();
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
            value={snap.name}
            onChange={(e) => actions.updateName(e.target.value)}
          />
        </div>
        <div className={styles.settings}>
          <Menu.Root>
            <Menu.Trigger className={styles.trigger}>
              <Settings size={32} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className={styles.Positioner} sideOffset={8}>
                <Menu.Popup className={styles.Popup}>
                  <Menu.Arrow className={styles.Arrow}>
                    <ArrowSvg />
                  </Menu.Arrow>
                  <Menu.Item
                    className={styles.Item}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Delete Board
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </div>
      <AlertDialog
        title="Delete Board"
        description="Delete this board? This can't be undone."
        actionName="Delete"
        onConfirm={deleteBoard}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
      />
    </>
  );
}
