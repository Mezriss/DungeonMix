import { AlertDialog } from "@base-ui-components/react/alert-dialog";

import styles from "@/styles/AlertDialog.module.css";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  actionName: string;
  onConfirm: () => void;
};

export default function AlertDialogComponent({
  title,
  open,
  description,
  actionName,
  onConfirm,
  setOpen,
}: Props) {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.Backdrop} />
        <AlertDialog.Popup className={styles.Popup}>
          <AlertDialog.Title className={styles.Title}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className={styles.Description}>
            {description}
          </AlertDialog.Description>
          <div className={styles.Actions}>
            <AlertDialog.Close className={"Button"}>Cancel</AlertDialog.Close>
            <AlertDialog.Close
              data-color="red"
              className={"Button"}
              onClick={onConfirm}
            >
              {actionName}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
