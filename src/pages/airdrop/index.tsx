import Header from "@/components/Header";
import type { NextPageContext } from "next";
import React from "react";

export default function Airdrop() {
  return <div>Airdrop</div>;
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}

Airdrop.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
