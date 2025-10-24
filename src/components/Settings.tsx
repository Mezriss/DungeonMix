import { useCallback, useId, useState } from "react";
import { useLocation } from "wouter";
import { AlertDialog } from "./ui/AlertDialog";
import Dialog from "./ui/Dialog";
import Tooltip from "./ui/Tooltip";
import { useBoardState } from "@/hooks/useBoardState";

import type { ChangeEvent } from "react";

import { Settings as SettingsIcon } from "lucide-react";
import styles from "@/styles/Settings.module.css";

export default function Settings() {
  return (
    <>
      <Dialog
        trigger={
          <Tooltip text="Settings">
            <SettingsIcon size={32} />
          </Tooltip>
        }
        title="Settings"
      >
        <div className={styles.settings}>
          <TrackFadeSetting />
          <AreaOpacity />
          <DeleteBoard />
        </div>
      </Dialog>
    </>
  );
}

function TrackFadeSetting() {
  const id = useId();
  const { data, actions } = useBoardState();
  const [duration, setDuration] = useState(
    String(data.settings.fadeDuration / 1000),
  );
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
    actions.setFadeDuration(parseFloat(e.target.value) * 1000);
  };

  return (
    <div>
      <label htmlFor={id}>Track fade duration, s</label>
      <input
        id={id}
        type="number"
        step={0.1}
        value={duration}
        onChange={onChange}
      />
    </div>
  );
}

function AreaOpacity() {
  const { data, actions } = useBoardState();
  const id = useId();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      actions.setAreaOpacity(value);
    }
  };

  return (
    <div>
      <label htmlFor={id}>Audio area opacity, %</label>
      <input
        id={id}
        type="number"
        step={1}
        min={0}
        max={100}
        value={data.settings.areaOpacity}
        onChange={onChange}
      />
    </div>
  );
}

function DeleteBoard() {
  const { actions } = useBoardState();

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
      <div>
        <span>Delete board</span>
        <button className="button" onClick={() => setIsDialogOpen(true)}>
          Delete
        </button>
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
