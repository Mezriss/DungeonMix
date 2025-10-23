import { Dialog as DialogComponent } from "@base-ui-components/react/dialog";

import { X } from "lucide-react";
import styles from "@/styles/Dialog.module.css";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
};

export default function Dialog({ trigger, children, title }: Props) {
  return (
    <DialogComponent.Root>
      <DialogComponent.Trigger render={<div />} nativeButton={false}>
        {trigger}
      </DialogComponent.Trigger>
      <DialogComponent.Portal>
        <DialogComponent.Backdrop className={"backdrop"} />
        <DialogComponent.Popup className={"popup"}>
          <div className={styles.header}>
            <DialogComponent.Title className={styles.title}>
              {title}
            </DialogComponent.Title>
            <DialogComponent.Close className={"button"}>
              <X size={16} />
            </DialogComponent.Close>
          </div>
          {children}
        </DialogComponent.Popup>
      </DialogComponent.Portal>
    </DialogComponent.Root>
  );
}
