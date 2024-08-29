import React, { useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { DatePicker } from "@mui/x-date-pickers";
import ImageUpload from "@/components/ImageUpload";
import dayjs from "dayjs";
import type { FormDtSchool } from "@/api/profile/model";
import { createNewSchool, updateSchool } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";

interface ModalEducationProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  isEditing: boolean;
  formDt: FormDtSchool;
  setSchool: React.Dispatch<React.SetStateAction<FormDtSchool[]>>;
}

export const ModalEducation: React.FC<ModalEducationProp> = ({
  handleClose,
  show,
  title,
  isEditing,
  formDt,
  setSchool,
}) => {
  const initialFormData = isEditing
    ? formDt
    : {
        name: "",
        logo: "",
        startDate: "",
        endDate: "",
        isGraduated: true,
        major: "",
        degree: "",
        description: "",
      };
  const [formData, setFormData] = useState(initialFormData);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageChange = (file: File) => {
    setUploadedImage(file);
    console.log("Uploaded Image: ", file);
    setFormData((prev) => ({ ...prev, logo: file }));
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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      degree: event.target.value,
    });
  };

  const submitAddSchool = async () => {
    try {
      const school = {
        name: formData.name,
        logo: "",
        startDate: new Date(formData.startDate),
        endDate: formData.isGraduated
          ? new Date("")
          : new Date(formData.endDate),
        isGraduated: formData.isGraduated,
        major: formData.major,
        degree: formData.degree,
        description: formData.description,
      };
      const newSchool = {
        education: [school],
      };
      await createNewSchool(newSchool);
      setSchool((prev) => [school, ...prev]);
      handleClose();
    } catch (error) {
      throwToast("Error creating education", "error");
    }
  };

  const submitEditSchool = async () => {
    try {
      const school = {
        id: formData.id,
        name: formData.name,
        logo: "",
        startDate: new Date(formData.startDate),
        endDate: formData.isGraduated
          ? new Date("")
          : new Date(formData.endDate),
        isGraduated: formData.isGraduated,
        major: formData.major,
        degree: formData.degree,
        description: formData.description,
      };
      const newSchool = {
        education: [school],
      };
      await updateSchool(newSchool);
      setSchool((prev) =>
        prev.map((edu) => (edu.id === initialFormData.id ? school : edu)),
      );
      handleClose();
    } catch (error) {
      throwToast("Error creating education", "error");
    }
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
            <ImageUpload
              folderUpload={""}
              onChange={handleImageChange}
              aspect={0}
              uploadAvatar={false}
              previewImage={""}
            />
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
              name="name"
              onChange={handleChange}
              placeholder="Please enter your education name"
            />

            <div style={{ width: "100%" }}>
              <div>
                <p className="m-0 py-1 fw-600 font-xss">Degree</p>
                <Select
                  value={formData.degree}
                  onChange={handleSelectChange}
                  displayEmpty
                  style={{ width: "100%", height: "32px" }}
                >
                  <MenuItem value="" disabled>
                    Select Degree
                  </MenuItem>
                  <MenuItem value="INTERMEDIATE">INTERMEDIATE</MenuItem>
                  <MenuItem value="ADVANCED">ADVANCED</MenuItem>
                  <MenuItem value="ENGINEERING DEGREE">
                    ENGINEERING DEGREE
                  </MenuItem>
                  <MenuItem value="BACHELOR's DEGREE">
                    BACHELOR`&apos;`S DEGREE
                  </MenuItem>
                  <MenuItem value="MASTER'S DEGREE">
                    MASTER`&apos;`S DEGREE
                  </MenuItem>
                  <MenuItem value="DOCTOR">DOCTOR</MenuItem>
                  <MenuItem value="DEGREE">DEGREE</MenuItem>
                  <MenuItem value="PHD">PHD</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
              </div>
              <div>
                <p className="m-0 py-1 fw-600 font-xss">Major</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "32px",
                  }}
                  value={formData.major}
                  onChange={handleChange}
                  name="major"
                  placeholder="Please enter your major name"
                />
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
            onClick={
              isEditing ? () => submitEditSchool() : () => submitAddSchool()
            }
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
