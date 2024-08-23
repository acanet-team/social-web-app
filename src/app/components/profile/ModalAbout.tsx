import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";

interface ModalAboutProps {
  title: string;
  show: boolean;
  data: string;
  handleClose: () => void;
  handleShow: () => void;
  setText: (arg: string) => string;
}

export const ModalAbout: React.FC<ModalAboutProps> = ({
  handleClose,
  handleShow,
  setText,
  show,
  title,
  data,
}) => {
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    if (window) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className={`${styles["customModal"]} nunito-font`}
      >
        <Modal.Header
          closeButton={fullscreen === "sm-down" ? false : true}
          className={styles["modal-header"]}
        >
          {fullscreen && (
            <i
              className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
              onClick={handleClose}
            ></i>
          )}
          <Modal.Title>
            <h1 className="m-0 fw-bold">{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles["modal-content"]}>
          <label className="fw-600 mt-3 mb-1" htmlFor="description">
            About Description
          </label>
          <textarea
            className="w-100 m-0 font-xsss fw-400 lh-20 theme-dark-bg d-flex"
            onChange={(event) => {
              setText(event.target.value);
            }}
            rows={10}
            value={data}
            maxLength={250}
            // style={{ resize: "none"}}
            placeholder="Please write your about description"
          />
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={handleClose}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
