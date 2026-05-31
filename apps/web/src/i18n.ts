import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }
  const localeMessages = (await import(`./messages/${locale}.json`)).default as AbstractIntlMessages;
  const fallbackMessages = locale !== "en"
    ? (await import(`./messages/en.json`)).default as AbstractIntlMessages
    : {} as AbstractIntlMessages;
  return {
    locale,
    messages: deepMerge(fallbackMessages as Record<string, unknown>, localeMessages as Record<string, unknown>) as AbstractIntlMessages,
  };
});

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    const b = base[key];
    const o = override[key];
    if (b && o && typeof b === "object" && typeof o === "object" && !Array.isArray(b)) {
      result[key] = deepMerge(b as Record<string, unknown>, o as Record<string, unknown>);
    } else {
      result[key] = o;
    }
  }
  return result;
}
