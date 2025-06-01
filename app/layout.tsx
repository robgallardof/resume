import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nextProviderWrapper } from "./providers/i18n-provider";
import LanguageGate from "@/components/LanguageGate";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Roberto Gallardo | Resume",
  description: "Full Stack .NET Developer Resume",
};

/**
 * Root layout that applies global styles, fonts, and wraps app with i18n provider.
 *
 * @param children React children components
 * @returns Root layout wrapper
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const lang = (await cookieStore).get("language")?.value || "en";

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nextProviderWrapper lang={lang}>
          <LanguageGate>{children}</LanguageGate>
        </I18nextProviderWrapper>
      </body>
    </html>
  );
}
