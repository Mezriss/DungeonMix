import { Menu } from "@base-ui-components/react/menu";
import styles from "@/styles/Menu.module.css";
import ArrowSvg from "@/assets/ArrowSvg";

type Props = {
  trigger: React.ReactNode;
  items: { name: string; onClick: () => void }[];
};

export default function MenuComponent({ trigger, items }: Props) {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.trigger}>{trigger}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={styles.positioner} sideOffset={8}>
          <Menu.Popup className={styles.popup}>
            <Menu.Arrow className={styles.arrow}>
              <ArrowSvg />
            </Menu.Arrow>
            {items.map((item, index) => (
              <Menu.Item
                className={styles.item}
                key={index}
                onClick={item.onClick}
              >
                {item.name}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
