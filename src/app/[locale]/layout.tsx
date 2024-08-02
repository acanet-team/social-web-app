import "@/styles/global.scss";

import SessionProvider from "@/utils/api/SessionProvider";
import { notFound, useRouter } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { AppConfig } from "@/utils/AppConfig";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";

config.autoAddCss = false;

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/auth";
import { useAccessTokenStore } from "@/store/accessToken";
import Session from "../components/auth/Session";

// export const metadata: Metadata = {
//   icons: [
//     {
//       rel: 'apple-touch-icon',
//       url: '/apple-touch-icon.png',
//     },
//     {
//       rel: 'icon',
//       type: 'image/png',
//       sizes: '32x32',
//       url: '/favicon-32x32.png',
//     },
//     {
//       rel: 'icon',
//       type: 'image/png',
//       sizes: '16x16',
//       url: '/favicon-16x16.png',
//     },
//     {
//       rel: 'icon',
//       url: '/favicon.ico',
//     },
//   ],
// };

export default function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!AppConfig.locales.includes(props.params?.locale)) notFound();

  // Using internationalization in Client Components
  const messages = useMessages();
  const { data: session } = useSession() as any;

  return (
    <SessionProvider>
      <html lang={props.params.locale}>
        <body className="color-theme-blue nunito-font loaded theme-dark">
          <NextIntlClientProvider
            locale={props.params.locale}
            messages={messages}
          >
            <ToastContainer />
            <Session />
            {/* <Header />
            <Leftnav /> */}
            {session && props.children}
            {/* <Popupchat />
            <Appfooter /> */}
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
