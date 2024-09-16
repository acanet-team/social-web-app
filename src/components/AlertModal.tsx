import React from "react";
import styles from "@/styles/modules/modal.module.scss";
import { useTranslations } from "next-intl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface AlertModalProps {
  show: boolean;
  message: string;
  title: string;
  type: string;
  handleClose: () => void;
  onProceed: () => void;
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
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className={`${styles["customModal"]} nunito-font`}
    >
      <Modal.Header closeButton={true} className={styles["modal-header"]}>
        <h2 className="d-flex w-100 fs-3 fw-bold ps-3 mb-0 justify-content-center">
          {title}
        </h2>
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>{message}</Modal.Body>
      <Modal.Footer className="w-100">
        <div className={styles["modal-actions"]}>
          <Button
            onClick={handleClose}
            className="text-dark fw-600 bg-transparent rounded-3 p-3 w125 border-0 mx-auto"
          >
            {tModal("modal_no")}
          </Button>
          <Button
            variant="primary"
            onClick={onProceed}
            className="main-btn bg-current text-center text-white fw-600 rounded-3 p-2 w125 border-0 mx-auto"
          >
            {type === "delete" ? tModal("modal_delete") : tModal("modal_yes")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(AlertModal);
