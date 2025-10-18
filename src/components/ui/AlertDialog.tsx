import { AlertDialog as Alert } from "@base-ui-components/react/alert-dialog";

import styles from "@/styles/AlertDialog.module.css";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  actionName: string;
  action: () => void;
};

export function AlertDialog({
  title,
  open,
  description,
  actionName,
  action,
  setOpen,
}: Props) {
  return (
    <Alert.Root open={open} onOpenChange={setOpen}>
      <Alert.Portal>
        <Alert.Backdrop className={"backdrop"} />
        <Alert.Popup className={"popup"}>
          <Alert.Title className={styles.title}>{title}</Alert.Title>
          <Alert.Description className={styles.description}>
            {description}
          </Alert.Description>
          <div className={styles.actions}>
            <Alert.Close className="button">Cancel</Alert.Close>
            <Alert.Close data-color="red" className="button" onClick={action}>
              {actionName}
            </Alert.Close>
          </div>
        </Alert.Popup>
      </Alert.Portal>
    </Alert.Root>
  );
}

type PropsT = {
  children: React.ReactNode;
  title: string;
  description: string;
  actionName: string;
  action: () => void;
};

export function AlertDialogTriggered({
  children,
  title,
  description,
  actionName,
  action,
}: PropsT) {
  return (
    <Alert.Root>
      <Alert.Trigger className="button">{children}</Alert.Trigger>
      <Alert.Portal>
        <Alert.Backdrop className={"backdrop"} />
        <Alert.Popup className={"popup"}>
          <Alert.Title className={styles.title}>{title}</Alert.Title>
          <Alert.Description className={styles.description}>
            {description}
          </Alert.Description>
          <div className={styles.actions}>
            <Alert.Close className="button">Cancel</Alert.Close>
            <Alert.Close data-color="red" className="button" onClick={action}>
              {actionName}
            </Alert.Close>
          </div>
        </Alert.Popup>
      </Alert.Portal>
    </Alert.Root>
  );
}
