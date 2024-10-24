import React from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { NextPageContext } from "next";
import { useTranslations } from "next-intl";

function ClaimSuccess() {
  const router = useRouter();
  const t = useTranslations("Claims");
  return (
    <div className={`pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      <div className={`text-center`}>
        <p className="font-lg fw-700 mt-3">
          {t("thanks_you_participate_program")}
        </p>
        <p className="font-md mt-5 mb-5">{t("des_claim_success")} 🚀🌱</p>
        <button
          onClick={() => router.push(`/`)}
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
        >
          {t("oke_got_it")}
        </button>
      </div>
    </div>
  );
}

export default ClaimSuccess;

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}

ClaimSuccess.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
