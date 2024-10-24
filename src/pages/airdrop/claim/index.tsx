import React, { useState } from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/router";
import CountdownDate from "@/components/CountDownDate";
import Header from "@/components/Header";
import { useWeb3 } from "@/context/wallet.context";
import { useLoading } from "@/context/Loading/context";

function Claim() {
  const router = useRouter();
  const { connectWallet, airDropContract, account } = useWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClaimNow = async () => {
    if (!account) {
      return connectWallet();
    }
    try {
      setIsLoading(true);
      const res = await airDropContract.withdraw({
        from: account.address,
        gasLimit: process.env.NEXT_PUBLIC_NFT_GAS_LIMIT,
      });
      res.wait();
      console.log("res", res);
      router.push(`/airdrop/claim/success`);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  // const [timeCountdown, setTimeCountdown] = useState(500000);
  return (
    <div className={`pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      <div className={`text-center`}>
        <p className="font-lg fw-700 mt-3 text-center">10,000 ACN</p>
        <p className="font-md mt-5 mb-5 text-center">
          Your ACN are ready to claim
        </p>
        <button
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
          onClick={handleClaimNow}
          disabled={isLoading}
        >
          Claim now
        </button>
      </div>
    </div>
  );
}

export default Claim;

Claim.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
