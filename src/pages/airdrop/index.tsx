import Header from "@/components/Header";
import type { NextPageContext } from "next";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWeb3 } from "@/context/wallet.context";

export default function Airdrop() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [telegramIdNotMatch, setTelegramIdNotMatch] = useState<boolean>(false);
  const [airDropTime, setAirDropTime] = useState<number>();
  // Get telegram id from query params
  const params = useSearchParams();
  const telegramParamId = params?.get("id") || "";
  const token = params?.get("token") || "";
  const { airDropContract } = useWeb3();
  const [isFirstRender, setIsFirstRender] = useState<boolean>(false);
  // console.log("session", session);
  // console.log("telegramParamId", telegramParamId);

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

  useEffect(() => {
    if (isFirstRender) {
      getAirDropStartTime();
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      setIsFirstRender(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("teleToken", token);
    }
  }, [token]);

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
      const telegramId = session.user?.telegram_id;
      const walletAddress = session.user?.walletAddress;
      // Corner case 2: if user go to /airdrop directly & he doesn't have a telegram id stored in DB
      if (!telegramId && !telegramParamId) {
        return router.push("/airdrop/miniapp");
      }
      if (!telegramId) {
        return router.push("/airdrop/verification");
      }
      if (telegramId !== telegramParamId) {
        return setTelegramIdNotMatch(true);
      }
      if (!walletAddress) {
        return router.push("/airdrop/wallet");
      }
      const now = new Date().getTime();
      if (airDropTime && now < airDropTime) {
        return router.push("/airdrop/countdown");
      }
      return router.push("/airdrop/claim");
    }
  }, [session, telegramParamId, airDropTime]);

  return (
    <div>
      {telegramIdNotMatch && (
        <div>
          This telegram account has already linked to another Acanet account.
        </div>
      )}
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

Airdrop.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
