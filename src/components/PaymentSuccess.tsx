import React from "react";
import styles from "@/styles/modules/payment.module.scss";

const PaymentSuccess: React.FC = () => {
  return (
    <div className={`${styles["container"]}`}>
      <svg width="200" height="200">
        <circle
          fill="#86c758"
          stroke="#e4f0df"
          strokeWidth="10"
          cx="100"
          cy="100"
          r="95"
          className={`${styles["circle"]} ${styles["circleActive"]}`}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
        <polyline
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="12"
          points="44,107 86.5,142 152,69"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles["tick"]} ${styles["tickActive"]}`}
        />
      </svg>
    </div>
  );
};

export default PaymentSuccess;
