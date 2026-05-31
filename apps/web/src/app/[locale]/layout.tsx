import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";
import ComplianceBanner from "@/components/ComplianceBanner";
import Navbar from "@/components/Navbar";

export function generateStaticParams() {
  return [
    "en","ko","zh","ja","th","vi","fr","es","de","pt","id","ms","ru","ar","hi","tr","it","tl"
  ].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ComplianceBanner />
      <Navbar />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}
