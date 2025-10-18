import { Switch } from "@base-ui-components/react/switch";
import styles from "@/styles/Switch.module.css";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function SwitchComponent({ checked, onChange }: Props) {
  return (
    <Switch.Root
      defaultChecked={checked}
      className={styles.switch}
      onCheckedChange={onChange}
    >
      <Switch.Thumb className={styles.thumb} />
    </Switch.Root>
  );
}
