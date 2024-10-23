import Header from "@/components/Header";
import type { NextPageContext } from "next";
import React, { useEffect } from "react";
import styles from "@/styles/modules/onboard.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ConnectWallet() {
  const router = useRouter();
  const tOnboard = useTranslations("Onboard");
  const { data: session } = useSession();
  const { connectWallet } = useWeb3();

  useEffect(() => {
    if (session && session.user?.walletAddress) {
      const airdrop_expiry_date = new Date("2024-11-11T23:59:59").getTime();
      const now = new Date().getTime();
      if (now < airdrop_expiry_date) {
        return router.push("/airdrop/countdown");
      }
      return router.push("/airdrop/claim");
    }
  }, [session]);

  const connectWalletHandler = () => {
    connectWallet();
  };
  return (
    <div className={styles["on-board-wallet"]}>
      <Image
        src="/assets/images/onboard/connect-wallet.svg"
        width={200}
        height={260}
        alt="verification"
      />
      <div className="fs-2 mt-4 fw-bold text-grey-700 text-dark text-center">
        {" "}
        {tOnboard("connect_wallet_title")}
      </div>
      <p className="text-center text-dark">
        {tOnboard("connect_wallet_subtitle")}
      </p>
      <button
        type="button"
        className={`${styles["onboard-btn"]} mt-5 d-block mx-auto border-0 py-2 px-5 main-btn rounded-3 font-xs`}
        onClick={connectWalletHandler}
      >
        {tOnboard("connect_wallet_button")}
      </button>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}

ConnectWallet.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
