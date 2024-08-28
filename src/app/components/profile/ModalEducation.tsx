import React, { useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ImageUpload from "@/components/ImageUpload";
import dayjs from "dayjs";

interface ModalEducationProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
  isEditing: boolean;
}

export const ModalEducation: React.FC<ModalEducationProp> = ({
  handleClose,
  handleShow,
  show,
  title,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    startDate: "",
    endDate: "",
    isGraduated: true,
    degree: "",
    description: "",
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageChange = (file: File) => {
    setUploadedImage(file);
    console.log("Uploaded Image: ", file);
    // setFormData(prev => ({ ...prev, logo: file }));
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isGraduated: e.target.value === "true",
    });
  };

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
            <ImageUpload folderUpload={""} onChange={handleImageChange} />
            <p className="m-0 py-1 fw-600 font-xss">Education Name</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "32px",
              }}
              value={formData.name}
              onChange={handleChange}
              placeholder="Please enter your education name"
            />

            <div style={{ width: "100%" }}>
              <p className="m-0 py-1 fw-600 font-xss">Degree</p>
              <input
                className="px-2"
                style={{
                  width: "100%",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  height: "32px",
                }}
                value={formData.degree}
                onChange={handleChange}
                placeholder="Please enter your degree name"
              />
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
                <p className="m-0 py-1 fw-600 font-xss">Is Graduated</p>
                <div>
                  <input
                    className="isGraduated"
                    type="radio"
                    name="isGraduated"
                    id="true"
                    value="true"
                    checked={formData.isGraduated === true}
                    onChange={handleRadioChange}
                  />
                  <span className="m-2 py-1">True</span>
                </div>
                <div>
                  <input
                    className="isGraduated"
                    type="radio"
                    name="isGraduated"
                    id="false"
                    value="false"
                    checked={formData.isGraduated === false}
                    onChange={handleRadioChange}
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
                <p className="m-0 py-1 fw-600 font-xss ">Start Year</p>
                <DatePicker
                  className="w__100"
                  value={dayjs(formData.startDate)}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      startDate: date ? dayjs(date).toISOString() : "",
                    })
                  }
                  views={["day", "month", "year"]}
                />
              </div>
              {!formData.isGraduated && (
                <div style={{ width: "48.5%" }}>
                  <p className="m-0 py-1 fw-600 font-xss">End Year</p>
                  <DatePicker
                    className="w__100"
                    value={dayjs(formData.endDate)}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        endDate: date ? dayjs(date).format("DD-MM-YYYY") : "",
                      })
                    }
                    views={["day", "month", "year"]}
                  />
                </div>
              )}
            </div>
            <p className="m-0 py-1 fw-600 font-xss">Description</p>
            <textarea
              className="px-2"
              value={formData.description}
              name="description"
              onChange={handleChange}
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
