import React, { useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface ModalLisenceProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
}

export const ModalLicense: React.FC<ModalLisenceProp> = ({
  handleClose,
  handleShow,
  show,
  title,
}) => {
  const [isWorking, setIsWorking] = useState(true);

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
          <form className="p-1">
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss">
                  License and Certification Name
                </p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "32px",
                  }}
                  value={""}
                  placeholder="Please enter your license or certification name"
                />
              </div>

              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss">Issuing Organization</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "32px",
                  }}
                  value={""}
                  placeholder="Please enter your issuing organization"
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss ">Issued year</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "32px",
                  }}
                  value={""}
                  placeholder="Please enter your issued year"
                />
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss">Credential</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "32px",
                  }}
                  value={""}
                  placeholder="Please enter your credential"
                />
              </div>
            </div>
          </form>
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
