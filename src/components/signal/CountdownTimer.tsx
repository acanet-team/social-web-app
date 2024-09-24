import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import styles from "@/styles/modules/countdownTimer.module.scss";

export default function CountdownTimer() {
  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a complete state
      return <span>Time&apos; up!</span>;
    } else {
      // Render a countdown
      return (
        <div className="text-center">
          <div
            className={`d-flex gap-2 justify-content-center ${styles["count-down"]}`}
          >
            <span className={styles["count-number"]}>
              <span className={styles["countdown-label"]}>Hour</span>
              {hours}
            </span>
            <span className={styles["count-down__colon"]}>:</span>
            <span className={styles["count-number"]}>
              <span className={styles["countdown-label"]}>Min</span>
              {minutes}
            </span>
            <span className={styles["count-down__colon"]}>:</span>
            <span className={styles["count-number"]}>
              <span className={styles["countdown-label"]}>Sec</span>
              {seconds}
            </span>
          </div>
        </div>
      );
    }
  };
  return (
    <Countdown date={Date.now() + 24 * 60 * 60 * 1000} renderer={renderer} />
  );
}
