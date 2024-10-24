import React, { useState } from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/router";
import CountdownDate from "@/components/CountDownDate";
import Header from "@/components/Header";
import type { NextPageContext } from "next";
import { useTranslations } from "next-intl";

function Claim() {
  const t = useTranslations("Claims");
  const router = useRouter();
  const handleClaimNow = () => {
    router.push(`/airdrop/claim/success`);
  };
  // const [timeCountdown, setTimeCountdown] = useState(500000);
  return (
    <div className={`pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      <div className={`text-center`}>
        <p className="font-lg fw-700 mt-3 text-center">10,000 ACN</p>
        <p className="font-md mt-5 mb-5 text-center">{t("des_claim")}</p>
        <button
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
          onClick={handleClaimNow}
        >
          {t("claim_now")}
        </button>
      </div>
    </div>
  );
}

export default Claim;

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}

Claim.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
