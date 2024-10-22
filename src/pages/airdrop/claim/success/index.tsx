import React from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/navigation";

function ClaimSuccess() {
  const router = useRouter();
  return (
    <div className={`pt-3 pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      <div className={`text-center`}>
        <p className="font-md fw-700 mt-3">
          Thank you for participating in our Airdrop program
        </p>
        <p className="font-md mt-5 mb-5">
          Start your exciting financial journey with Acanet today and watch your
          success grow! 🚀🌱
        </p>
        <button
          onClick={() => router.push(`/`)}
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
        >
          Ok, got it
        </button>
      </div>
    </div>
  );
}

export default ClaimSuccess;
