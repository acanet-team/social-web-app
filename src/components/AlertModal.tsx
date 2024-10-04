import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/modal.module.scss";
import { useTranslations } from "next-intl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface AlertModalProps {
  show: boolean;
  message: string;
  title: string;
  type: "delete" | "reject" | "alert";
  handleClose: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onProceed: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  show,
  message,
  title,
  handleClose,
  type,
  onProceed,
}) => {
  const tModal = useTranslations("Modal");
  const tBase = useTranslations("Base");
  const [remainingTime, setRemainingTime] = useState(3);

  // Auto close after 3 seconds
  useEffect(() => {
    if (show && type === "alert") {
      setRemainingTime(3); // Reset the countdown
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleClose(
              new MouseEvent(
                "click",
              ) as unknown as React.MouseEvent<HTMLButtonElement>,
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    return undefined;
  }, [show, type]);

  const onHandleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    handleClose(e);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size={type === "alert" ? "sm" : "lg"}
      className={`${styles["customModal"]} font-system`}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      <Modal.Header closeButton={true} className={styles["modal-header"]}>
        <h2 className="d-flex w-100 fs-3 fw-bold ps-3 mb-0 justify-content-center">
          {title}
        </h2>
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        {message}
        {type === "alert" && (
          <div className="mt-2 font-xss">
            {tModal("close_after")} {remainingTime}{" "}
            {remainingTime > 1 ? tBase("seconds") : tBase("second")}...
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="w-100">
        <div className={styles["modal-actions"]}>
          {type === "alert" ? (
            ""
          ) : (
            <Button
              onClick={onHandleClose}
              className="text-dark fw-600 bg-transparent rounded-3 p-3 w125 border-0 mx-auto"
            >
              {tModal("modal_no")}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onProceed}
            className="main-btn bg-current text-center text-white fw-600 rounded-3 p-2 w125 border-0 mx-auto"
          >
            {type === "delete"
              ? tModal("modal_delete")
              : type === "alert"
                ? tModal("modal_ok")
                : tModal("modal_yes")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(AlertModal);
