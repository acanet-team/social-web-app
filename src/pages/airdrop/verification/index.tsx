import Header from "@/components/Header";
import type { NextPageContext } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/onboard.module.scss";
import OTP from "@/components/onboard/OTP";
import { resolve } from "dns";
import { useTranslations } from "next-intl";

export default function Verification() {
  const tOnboard = useTranslations("Onboard");
  const [otp, setOtp] = useState<string>("");
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [isOTPwrong, setIsOTPwrong] = useState<boolean>(false);
  const [attempLeft, setAttempLeft] = useState<number>(4);

  const OTP_LENGTH = 4;

  const sendOTP = async () => {
    if (otp.length === OTP_LENGTH) {
      // Send OTP to BE
      try {
        setIsSendingOTP(true);
        console.log("loggg", otp);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSendingOTP(false);
      }
    }
  };

  useEffect(() => {
    sendOTP();
  }, [otp]);

  return (
    <div className={styles["onboard-verify"]} id="onboard-verification">
      <Image
        src="/assets/images/onboard/otp.svg"
        width={180}
        height={250}
        alt="verification"
      />
      <h1 className="fs-3 mt-3 fw-bold text-grey-700 text-center">
        {tOnboard("otp_verify")}
      </h1>
      <div className="text-center">{tOnboard("enter_otp")}</div>
      <div className="mt-4 d-flex justify-content-center">
        <OTP
          separator={<span>-</span>}
          value={otp}
          onChange={setOtp}
          length={OTP_LENGTH}
          isOTPwrong={isOTPwrong}
        />
      </div>
      <div className="text-center mt-3">
        {`${tOnboard("attempt_begin")} ${attempLeft} ${attempLeft > 1 ? tOnboard("attemp_end_plural") : tOnboard("attemp_end_singular")}`}
      </div>
      <button
        type="button"
        className={`${isSendingOTP ? "btn-loading" : "bg-current"} ${styles["onboard-btn"]} mt-5 d-block mx-auto border-0 py-2 px-5 main-btn rounded-3 font-xs`}
        onClick={sendOTP}
      >
        {isSendingOTP ? (
          <span
            className="spinner-border spinner-border-md"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          tOnboard("next")
        )}
      </button>
      <div className="text-center mt-3 font-xss">
        <span>{tOnboard("retry_text")}</span>{" "}
        <span className={styles["onboard-resend"]}>
          {tOnboard("retry_send_code")}
        </span>
      </div>
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

Verification.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
