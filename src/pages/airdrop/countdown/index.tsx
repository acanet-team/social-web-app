import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/router";
import CountdownDate from "@/components/CountDownDate";
import Header from "@/components/Header";
import type { NextPageContext } from "next";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";

function CountDown() {
  const t = useTranslations("Claims");
  const router = useRouter();
  const { airDropContract, connectWallet } = useWeb3();
  const [airDropTime, setAirDropTime] = useState<number>(0);
  // const airdrop_expiry_date = new Date("2024-11-11T23:59:59").getTime();

  const getAirDropStartTime = async () => {
    try {
      const startTime = await airDropContract.startTime();
      console.log("start time", startTime.toNumber());
      setAirDropTime(startTime.toNumber());
    } catch (error) {
      console.error("Failed to fetch airdrop start time:", error);
    }
  };

  useEffect(() => {
    getAirDropStartTime();
  }, []);
  return (
    <div className={`pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      <div className={`text-center`}>
        <p className="font-lg fw-700 mt-3 text-center">
          {t("title_countdown")}
        </p>
        <p className="font-md mt-5 text-center">{t("claim_token_countdown")}</p>
        <CountdownDate time={Number(airDropTime * 1000)} />
        <p className="font-md mt-5 mb-5 text-center">{t("des_countdown")}</p>
        <button
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
          onClick={() => router.push(`/`)}
        >
          {t("oke_got_it")}
        </button>
      </div>
    </div>
  );
}

export default CountDown;

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}

CountDown.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
