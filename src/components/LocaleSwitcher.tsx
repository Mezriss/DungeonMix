import { i18n } from "@lingui/core";
import { useState } from "react";
import Select from "@/components/ui/Select";
import { LOCALE_KEY } from "@/const";
import { dynamicActivate, locales } from "@/i18n";
import { classes } from "@/util/misc";

import { Languages } from "lucide-react";
import styles from "@/styles/LocaleSwitcher.module.css";

const localeList = Object.keys(locales).map((locale) => ({
  label: locales[locale as keyof typeof locales],
  value: locale,
}));

export default function LocaleSwitcher() {
  const [open, setOpen] = useState(false);

  const onChange = (value: string) => {
    dynamicActivate(value);
    localStorage.setItem(LOCALE_KEY, value);
  };

  return (
    <div className={styles.switcher}>
      <button className={"button"} onClick={() => setOpen(!open)}>
        <Languages />
      </button>
      <div className={classes(styles.switch, open && styles.open)}>
        <Select
          items={localeList}
          onChange={onChange}
          defaultValue={i18n.locale}
        />
      </div>
    </div>
  );
}
