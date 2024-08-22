import React from "react";
import styles from "@/styles/modules/modal.module.scss";
import classes from "@/styles/modules/createProfile.module.scss";
import type { ModalProps } from "@/types/dto";

const Modal: React.FC<ModalProps> = ({ onCancel, onOk, title }) => {
  return (
    <>
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-content"]} id={styles["community-form"]}>
          <div className={styles["modal-header"]}>
            <h5 className="fs-1 fw-bolder m-0">{title}</h5>
          </div>
          <button
            type="button"
            className="btn-close position-absolute right-15 top-10"
            onClick={onCancel}
          ></button>

          <div className={classes["button-group"]}>
            <button onClick={onOk} className={classes["ok-button"]}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
