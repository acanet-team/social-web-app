import '@/styles/global.scss';

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
  // params: { locale: string };
}) {
  // // Validate that the incoming `locale` parameter is valid
  // if (!AppConfig.locales.includes(props.params?.locale)) notFound();

  // // Using internationalization in Client Components
  // const messages = useMessages();

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html
    // lang={props.params?.locale}
    >
      <body className="color-theme-blue mont-font loaded theme-light">
        {/* <NextIntlClientProvider
          locale={props.params?.locale}
          messages={messages}
        > */}
        {props.children}

        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
