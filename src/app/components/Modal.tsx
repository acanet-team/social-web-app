import React from "react";
import styles from "@/styles/modules/modal.module.scss";

interface CustomModalProps {
  message: string;
  onCancel: () => void;
  onOk: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  message,
  onCancel,
  onOk,
}) => {
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <p className="fs-4 mb-4">{message}</p>
        <div className={styles["button-group"]}>
          <button onClick={onCancel} className={styles["cancel-button"]}>
            Cancel
          </button>
          <button onClick={onOk} className={styles["ok-button"]}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CustomModal);
