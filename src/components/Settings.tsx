import { i18n } from "@lingui/core";
import { useCallback, useContext, useId, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { useLocation } from "wouter";
import { AlertDialog } from "./ui/AlertDialog";
import Dialog from "./ui/Dialog";
import Select from "./ui/Select";
import Tooltip from "./ui/Tooltip";
import { LOCALE_KEY } from "@/const";
import { dynamicActivate, locales } from "@/i18n";
import { BoardStateContext } from "@/providers/BoardStateContext";

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
          <Language />
          <DeleteBoard />
        </div>
      </Dialog>
    </>
  );
}

function TrackFadeSetting() {
  const id = useId();
  const state = useContext(BoardStateContext);
  const data = useSnapshot(state.data);
  const [duration, setDuration] = useState(
    String(data.settings.fadeDuration / 1000),
  );
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
    state.actions.setFadeDuration(parseFloat(e.target.value) * 1000);
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
  const state = useContext(BoardStateContext);
  const data = useSnapshot(state.data);
  const id = useId();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      state.actions.setAreaOpacity(value);
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

function Language() {
  const localeList = useMemo(
    () =>
      Object.keys(locales).map((locale) => ({
        label: locales[locale as keyof typeof locales],
        value: locale,
      })),
    [],
  );

  const onChange = (value: string) => {
    dynamicActivate(value);
    localStorage.setItem(LOCALE_KEY, value);
  };

  return (
    <div>
      <div>Language</div>
      <Select
        items={localeList}
        onChange={onChange}
        defaultValue={i18n.locale}
      />
    </div>
  );
}

function DeleteBoard() {
  const { actions } = useContext(BoardStateContext);

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
