import "@/styles/global.scss";

import SessionProvider from "@/utils/api/SessionProvider";
import { AppConfig } from "@/utils/AppConfig";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";

config.autoAddCss = false;

import { ToastContainer } from "react-toastify";

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

  return (
    <SessionProvider>
      <html lang={props.params.locale}>
        <body className="color-theme-blue nunito-font loaded theme-light">
          <NextIntlClientProvider
            locale={props.params.locale}
            messages={messages}
          >
            <ToastContainer />
            {/* <Session /> */}
            {props.children}
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
