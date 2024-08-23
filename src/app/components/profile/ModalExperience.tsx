import React, { useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface ModalExperienceProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
}

export const ModalExperience: React.FC<ModalExperienceProp> = ({
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
            <p className="m-0 py-1 fw-600 font-xss">Company Name</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "32px",
              }}
              value={""}
              placeholder="Please enter your company name"
            />
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss">Job Title</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "32px",
                  }}
                  value={""}
                  placeholder="Please enter your industry name"
                />
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss">Employment Type</p>
                <Select style={{ width: "100%", height: "32px" }}>
                  <option className="p-1" value="Full-Time">
                    Full-Time
                  </option>
                  <option className="p-1" value="Part-Time">
                    Part-Time
                  </option>
                  <option className="p-1" value="Casual">
                    Casual
                  </option>
                  <option className="p-1" value="Contractor">
                    Contractor
                  </option>
                  <option className="p-1" value="Self-employed">
                    Self-employed
                  </option>
                </Select>
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <p className="m-0 py-1 fw-600 font-xss">Is Working</p>
                <div>
                  <input
                    className=""
                    type="radio"
                    name="true"
                    id=""
                    value="true"
                    checked={isWorking === true}
                    onChange={() => setIsWorking(true)}
                  />
                  <span className="m-2 py-1">True</span>
                </div>
                <div>
                  <input
                    className="py-1"
                    type="radio"
                    name="false"
                    id=""
                    value="false"
                    checked={isWorking === false}
                    onChange={() => setIsWorking(false)}
                  />
                  <span className="m-2">False</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "48.5%",
                }}
              >
                <p className="m-0 py-1 fw-600 font-xss ">Start Date</p>
                <DatePicker
                  className="w__100"
                  views={["day", "month", "year"]}
                />
              </div>
              {!isWorking && (
                <div style={{ width: "48.5%" }}>
                  <p className="m-0 py-1 fw-600 font-xss">End Date</p>
                  <DatePicker
                    className="w__100"
                    views={["day", "month", "year"]}
                  />
                </div>
              )}
            </div>
            <p className="m-0 py-1 fw-600 font-xss">Location</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                height: "32px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              value={""}
              placeholder="Please enter your location"
            />
            <p className="m-0 py-1 fw-600 font-xss">Description</p>
            <textarea
              className="px-2"
              value={""}
              placeholder="Please enter your description"
              maxLength={1000}
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
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
