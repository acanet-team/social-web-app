import httpClient from "@/api";
import { type ISession } from "@/api/auth/auth.model";
import { RouterProgressBar } from "@/components/RouterProgressBar";
import Loading from "@/context/Loading";
import { LoadingProvider } from "@/context/Loading/context";
import RootLayout from "@/layout/root";
import "@/styles/global.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { NextPage } from "next";
import { getSession, SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import App from "next/app";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { type ReactElement, type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);
  const router = useRouter();

  return (
    <SessionProvider refetchInterval={10}>
      <NextIntlClientProvider
        locale={"en"}
        timeZone="Europe/Vienna"
        messages={pageProps.messages}
      >
        <ToastContainer />
        <LoadingProvider>
          <RouterProgressBar />
          {getLayout(<Component {...pageProps} />)}
          <Loading />
        </LoadingProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);
  const session = (await getSession(appContext)) as unknown as ISession;
  if (session) {
    setCookie(appContext.ctx, "acanet_token", session?.accessToken, {
      path: "/",
    });
    httpClient.setAuthorization(session.accessToken);
  }
  return { ...appProps, session };
};
