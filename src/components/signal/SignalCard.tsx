import React, { useState } from "react";
import styles from "@/styles/modules/signalCard.module.scss";
import classNames from "classnames";

export default function SignalCard() {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const onFlipCardHandler = () => {
    setIsFlipped(true);
    // Calling api to fetch data for the back
  };
  return (
    <div
      className={classNames(styles.signal, styles["signal--card"])}
      onClick={onFlipCardHandler}
    >
      <div
        className={`${isFlipped ? styles["is-flipped"] : ""} ${styles.card}`}
      >
        <div
          className={classNames(
            styles["card__face"],
            styles["card__face--front"],
          )}
        >
          front
        </div>
        <div
          className={classNames(
            styles["card__face"],
            styles["card__face--back"],
          )}
        >
          back
        </div>
      </div>
    </div>
  );
}
