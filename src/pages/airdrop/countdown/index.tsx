import React, { useState } from "react";
import styles from "@/styles/modules/claim.module.scss";
import PaymentSuccess from "@/components/PaymentSuccess";
import { useRouter } from "next/router";
import CountdownDate from "@/components/CountDownDate";
import Header from "@/components/Header";

function CountDown() {
  const router = useRouter();
  const airdrop_expiry_date = new Date("2024-11-11T23:59:59").getTime();
  return (
    <div className={`pb-5 ${styles["card-claim"]}`}>
      <PaymentSuccess />
      <div className={`text-center`}>
        <p className="font-lg fw-700 mt-3 text-center">You are all set up!</p>
        <p className="font-md mt-5 text-center">You can claim your token in:</p>
        <CountdownDate time={airdrop_expiry_date} />
        <p className="font-md mt-5 mb-5 text-center">
          Meanwhile, you can enjoy all the feature of our product
        </p>
        <button
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
          onClick={() => router.push(`/`)}
        >
          Ok, got it
        </button>
      </div>
    </div>
  );
}

export default CountDown;

CountDown.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
