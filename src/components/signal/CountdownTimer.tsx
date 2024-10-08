import React, { type Dispatch, type SetStateAction } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import styles from "@/styles/modules/countdownTimer.module.scss";
import { useTranslations } from "next-intl";

export default function CountdownTimer(props: {
  time: number;
  onFinish: Dispatch<SetStateAction<void>>;
}) {
  const tBase = useTranslations("Base");
  const renderer = ({
    formatted: { hours, minutes, seconds },
    completed,
  }: any) => {
    if (completed) {
      // Trigger onFinish callback
      props.onFinish();
      return null;
    } else {
      // Render a countdown
      return (
        <div className="text-center">
          <div
            className={`d-flex gap-2 justify-content-center ${styles["count-down"]}`}
          >
            <span className={styles["count-number"]}>
              <span className={styles["countdown-label"]}>{tBase("hour")}</span>
              {hours}
            </span>
            <span className={styles["count-down__colon"]}>:</span>
            <span className={styles["count-number"]}>
              <span className={styles["countdown-label"]}>{tBase("min")}</span>
              {minutes}
            </span>
            <span className={styles["count-down__colon"]}>:</span>
            <span className={styles["count-number"]}>
              <span className={styles["countdown-label"]}>{tBase("sec")}</span>
              {seconds}
            </span>
          </div>
        </div>
      );
    }
  };
  return <Countdown date={props.time} renderer={renderer} daysInHours={true} />;
}
