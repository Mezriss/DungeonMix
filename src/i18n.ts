import { i18n } from "@lingui/core";
import { LOCALE_KEY } from "./const";

export const locales = {
  en: "English",
  ua: "Українська",
};

export const defaultLocale = "en";

export function detectLocale() {
  const userLocale =
    localStorage.getItem(LOCALE_KEY) || navigator.language || defaultLocale;

  return userLocale.replace(/-.+$/, "");
}

export async function dynamicActivate(locale: string) {
  if (!Object.keys(locales).includes(locale)) {
    locale = defaultLocale;
  }

  const { messages } = await import(`./locales/${locale}/messages.ts`);

  i18n.loadAndActivate({ locale, messages });
  console.log(i18n.locale);
}
