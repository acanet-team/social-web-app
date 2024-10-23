import Header from "@/components/Header";
import type { NextPageContext } from "next";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Airdrop() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [telegramIdNotMatch, setTelegramIdNotMatch] = useState<boolean>(false);
  const params = useSearchParams();
  const telegramParamId = params?.get("id") || "";
  // Get telegram id from query params
  console.log("session", session);
  console.log("telegramParamId", telegramParamId);

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
      const telegramId = session.user?.telegram_id;
      const walletAddress = session.user?.walletAddress;
      // Corner case 2
      if (!telegramId && telegramParamId) {
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
      const airdrop_expiry_date = new Date("2024-11-11T23:59:59").getTime();
      const now = new Date().getTime();
      if (now < airdrop_expiry_date) {
        return router.push("/airdrop/countdown");
      }
      return router.push("/airdrop/claim");
    }
  }, [session, telegramParamId]);

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
