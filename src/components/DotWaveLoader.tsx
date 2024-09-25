import React from "react";
import styles from "@/styles/modules/dotWaveLoader.module.scss";

export default function DotWaveLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
      <div className={styles["dots-3"]}></div>
      <div className={styles["dots-3"]}></div>
    </div>
  );
}
