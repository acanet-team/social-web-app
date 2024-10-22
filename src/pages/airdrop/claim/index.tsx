import React, { useState } from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/router";
import CountdownDate from "@/components/CountDownDate";

function Claim() {
  const router = useRouter();
  const handleClaimNow = () => {
    router.push(`/airdrop/claim/success`);
  };
  const [timeCountdown, setTimeCountdown] = useState(500000);
  return (
    <div className={`pt-3 pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      {timeCountdown === 0 ? (
        <div className={`text-center`}>
          <p className="font-md fw-700 mt-3">10,000 ACN</p>
          <p className="font-md mt-5 mb-5">Your ACN are ready to claim</p>
          <button
            className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
            onClick={handleClaimNow}
          >
            Claim now
          </button>
        </div>
      ) : (
        <div className={`text-center`}>
          <p className="font-md fw-700 mt-3">You are all set up!</p>
          <p className="font-md mt-5">You can claim your token in:</p>
          {/* <CountdownTimer time={1200000} onFinish={() => setIsFlipped(false)} /> */}
          <CountdownDate time={timeCountdown} />
          <p className="font-md mt-5 mb-5">
            Meanwhile, you can enjoy all the feature of our product
          </p>
          <button
            className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
            onClick={() => router.push(`/`)}
          >
            Ok, got it
          </button>
        </div>
      )}
    </div>
  );
}

export default Claim;
