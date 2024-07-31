import React from "react";
import styles from "@/styles/modules/waveLoader.module.scss";

export default function DotLoad() {
  return (
    <div
      className="card w-100 text-center shadow-xss rounded-xxl border-0 p-4 mb-3 mt-3"
      id={styles.load}
    >
      <div className="snippet mt-2 ms-auto me-auto" data-title=".dot-typing">
        <div className="stage">
          <div className="dot-typing"></div>
        </div>
      </div>
    </div>
  );
}
