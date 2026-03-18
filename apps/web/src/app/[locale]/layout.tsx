import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ComplianceBanner from "@/components/ComplianceBanner";
import Navbar from "@/components/Navbar";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ComplianceBanner />
      <Navbar />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}
