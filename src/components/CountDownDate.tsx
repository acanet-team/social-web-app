import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import styles from "@/styles/modules/countdownDate.module.scss";

export default function CountdownDate(props: { time: number }) {
  const renderer = ({
    formatted: { days, hours, minutes, seconds },
  }: CountdownRenderProps) => {
    return (
      <div className="text-center">
        <div
          className={`d-flex gap-2 justify-content-center ${styles["count-down"]}`}
        >
          <span className={styles["count-number"]}>
            <span className={`${styles["countdown-label"]}`}>Days</span>
            {days}
          </span>
          <span className={`${styles["count-down__colon"]} mt-3`}>:</span>
          <span className={styles["count-number"]}>
            <span className={styles["countdown-label"]}>Hours</span>
            {hours}
          </span>
          <span className={`${styles["count-down__colon"]} mt-3`}>:</span>
          <span className={styles["count-number"]}>
            <span className={styles["countdown-label"]}>Minutes</span>
            {minutes}
          </span>
          <span className={`${styles["count-down__colon"]} mt-3`}>:</span>
          <span className={styles["count-number"]}>
            <span className={styles["countdown-label"]}>Seconds</span>
            {seconds}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Countdown date={props.time} renderer={renderer} daysInHours={false} />
  );
}
