import Header from "@/components/Header";
import type { NextPageContext } from "next";
import React, { useEffect, useState } from "react";
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
  const { airDropContract, connectWallet } = useWeb3();
  const [airDropTime, setAirDropTime] = useState<number>();
  const [isFirstRender, setIsFirstRender] = useState<boolean>(false);

  const getAirDropStartTime = async () => {
    try {
      if (!airDropContract) {
        throw new Error("Airdrop contract is not initialized");
      }
      const startTime = await airDropContract.startTime();
      console.log("start time", startTime.toNumber());
      setAirDropTime(startTime.toNumber());
    } catch (error) {
      console.error("Failed to fetch airdrop start time:", error);
    }
  };

  const connectWalletHandler = () => {
    connectWallet();
  };

  useEffect(() => {
    if (isFirstRender) {
      getAirDropStartTime();
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (session && session.user?.walletAddress) {
      const now = new Date().getTime();
      if (airDropTime && now < airDropTime) {
        return router.push("/airdrop/countdown");
      }
      return router.push("/airdrop/claim");
    }
  }, [session]);

  useEffect(() => {
    if (!isFirstRender) {
      setIsFirstRender(true);
    }
  }, []);

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
