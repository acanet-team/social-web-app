import React from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { NextPage, NextPageContext } from "next";

const Communities: NextPage = () => {
  return <div>Communities</div>;
};

export default Communities;
export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
