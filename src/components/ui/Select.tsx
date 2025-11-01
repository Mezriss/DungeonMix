import { Select as SelectComponent } from "@base-ui-components/react";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import styles from "@/styles/Select.module.css";

type Props = {
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function Select({ items, value, onChange }: Props) {
  return (
    <div>
      <SelectComponent.Root
        items={items}
        value={value}
        onValueChange={onChange}
      >
        <SelectComponent.Trigger className={styles.select}>
          <SelectComponent.Value />
          <SelectComponent.Icon className={styles.selectIcon}>
            <ChevronsUpDown />
          </SelectComponent.Icon>
        </SelectComponent.Trigger>
        <SelectComponent.Portal>
          <SelectComponent.Positioner
            className={styles.positioner}
            sideOffset={8}
          >
            <SelectComponent.Popup className={styles.popup}>
              <SelectComponent.ScrollUpArrow className={styles.scrollArrow} />
              <SelectComponent.List className={styles.list}>
                {items.map(({ label, value }) => (
                  <SelectComponent.Item
                    key={label}
                    value={value}
                    className={styles.item}
                  >
                    <SelectComponent.ItemIndicator
                      className={styles.itemIndicator}
                    >
                      <CheckIcon className={styles.itemIndicatorIcon} />
                    </SelectComponent.ItemIndicator>
                    <SelectComponent.ItemText className={styles.itemText}>
                      {label}
                    </SelectComponent.ItemText>
                  </SelectComponent.Item>
                ))}
              </SelectComponent.List>
              <SelectComponent.ScrollDownArrow className={styles.scrollArrow} />
            </SelectComponent.Popup>
          </SelectComponent.Positioner>
        </SelectComponent.Portal>
      </SelectComponent.Root>
    </div>
  );
}
