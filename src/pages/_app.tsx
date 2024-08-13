import httpClient from "@/api";
import { ONBOARDING_STEP, type ISession } from "@/api/auth/auth.model";
import { AppProvider, useApp } from "@/context/app.context";
import Loading from "@/context/Loading";
import { LoadingProvider } from "@/context/Loading/context";
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
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppProvider session={pageProps.session}>
      <SessionProvider refetchInterval={10}>
        <NextIntlClientProvider
          locale={"en"}
          timeZone="Europe/Vienna"
          messages={pageProps.messages}
        >
          <LoadingProvider>
            {getLayout(<Component {...pageProps} />)}
            <Loading />
          </LoadingProvider>
        </NextIntlClientProvider>
      </SessionProvider>
    </AppProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);
  const session = (await getSession(appContext)) as unknown as ISession;
  if (!session || session.needToLogin) {
    if (appContext.ctx.res && appContext.ctx.asPath !== "/login") {
      appContext.ctx.res.writeHead(302, {
        Location: "/login",
      });
      appContext.ctx.res.end();
      return;
    }
  } else {
    appProps.pageProps["session"] = session;
    httpClient.setAuthorization(session?.accessToken);
    if (session.user.onboarding_data?.step !== ONBOARDING_STEP.COMPLETE) {
      console.log("appContext.ctx.asPath", appContext.ctx.asPath);
      if (
        appContext.ctx.res &&
        appContext.ctx.asPath !== "/onboarding" &&
        !appContext.ctx.asPath.includes("next")
      ) {
        appContext.ctx.res.writeHead(302, {
          Location: "/onboarding",
        });
        appContext.ctx.res.end();
        return;
      }
    }
  }
  return { ...appProps, session };
};
