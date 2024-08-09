import "@/styles/global.scss";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { useRouter } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>
      <NextIntlClientProvider
        locale={"en"}
        timeZone="Europe/Vienna"
        messages={pageProps.messages}
      >
        {getLayout(<Component {...pageProps} />)}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
