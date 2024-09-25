import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document({
  messages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Html lang="vi" className="color-theme-blue nunito-font loaded">
      <Head>
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, viewport-fit=cover"
        />
        <title>Acanet</title> */}

        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
