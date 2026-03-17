import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ko", "th", "vi"],
  defaultLocale: "en",
});
