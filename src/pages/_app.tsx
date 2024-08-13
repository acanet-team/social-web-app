import httpClient from "@/api";
import { ONBOARDING_STEP, type ISession } from "@/api/auth/auth.model";
import { AppProvider, useApp } from "@/context/app.context";
import { useAccessTokenStore } from "@/store/accessToken";
import "@/styles/global.scss";
import type { NextPage } from "next";
import { getSession, SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import App from "next/app";
import { redirect, useRouter } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <AppProvider session={pageProps.session}>
      <SessionProvider>
        <NextIntlClientProvider
          locale={"en"}
          timeZone="Europe/Vienna"
          messages={pageProps.messages}
        >
          {getLayout(<Component {...pageProps} />)}
        </NextIntlClientProvider>
      </SessionProvider>
    </AppProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);

  const session = (await getSession(appContext)) as unknown as ISession;
  if (session) {
    appProps.pageProps["session"] = session;
    httpClient.setAuthorization(session?.token);
    if (session.user.onboarding_data.step !== ONBOARDING_STEP.COMPLETE) {
      if (appContext.ctx.res && appContext.ctx.asPath !== "/onboarding") {
        appContext.ctx.res.writeHead(302, {
          Location: "/onboarding",
        });
        appContext.ctx.res.end();
        return;
      }
    }
  }
  //  else {
  //   redirect('/login')
  // }

  return { ...appProps, session };
};
