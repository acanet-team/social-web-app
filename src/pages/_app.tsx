import httpClient from "@/api";
import { type ISession } from "@/api/auth/auth.model";
import { RouterProgressBar } from "@/components/RouterProgressBar";
import Loading from "@/context/Loading";
import { LoadingProvider } from "@/context/Loading/context";
import { WalletProvider } from "@/context/wallet.context";
import "@/styles/global.scss";
import { initWeb3Onboard } from "@/web3/onboard";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { NextPage } from "next";
import { getSession, SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import App from "next/app";
import { setCookie } from "nookies";
import { type JSX, type ReactElement, type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { WebSocketProvider } from "@/context/websocketProvider";
import { GuestTokenProvider } from "@/context/guestToken";
import RootLayout from "@/layout/root";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
initWeb3Onboard();
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);

  return (
    <SessionProvider refetchInterval={10}>
      <WebSocketProvider>
        <NextIntlClientProvider
          locale={"en"}
          timeZone="Europe/Vienna"
          messages={pageProps.messages}
        >
          <WalletProvider>
            <ToastContainer />
            <LoadingProvider>
              <RouterProgressBar />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {getLayout(<Component {...pageProps} />)}
              </LocalizationProvider>
              <Loading />
            </LoadingProvider>
          </WalletProvider>
        </NextIntlClientProvider>
      </WebSocketProvider>
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
