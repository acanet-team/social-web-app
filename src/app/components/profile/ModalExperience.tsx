import React, { useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { BrokerProfile, FormDt } from "@/api/profile/model";
import dayjs from "dayjs";
import { createNewExperiences, updateExperiences } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import ImageUpload from "@/components/ImageUpload";

interface ModalExperienceProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  isEditing: boolean;
  dataBrokerProfile: BrokerProfile;
  formDt: FormDt;
}

export const ModalExperience: FC<ModalExperienceProp> = ({
  handleClose,
  isEditing,
  show,
  title,
  dataBrokerProfile,
  formDt,
}) => {
  const initialFormData = isEditing
    ? formDt
    : {
        logo: "",
        name: "",
        startDate: "",
        endDate: "",
        isWorking: true,
        position: "",
        location: "",
        description: "",
        workingType: "",
      };

  const [formData, setFormData] = useState(initialFormData);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageChange = (file: File) => {
    setUploadedImage(file);
    console.log("Uploaded Image: ", file);
    // setFormData({
    //   ...formData,
    //   logo: uploadedImage,
    // });
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      workingType: event.target.value,
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isWorking: e.target.value === "true",
    });
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

  const submitAddExperience = async () => {
    try {
      const newExperience = {
        company: [
          {
            logo: "",
            name: formData.name,
            startDate: new Date(formData.startDate),
            endDate: formData.isWorking
              ? new Date("")
              : new Date(formData.startDate),
            isWorking: formData.isWorking,
            position: formData.position,
            location: formData.location,
            description: formData.description,
            workingType: formData.workingType,
          },
        ],
      };
      await createNewExperiences(newExperience);
      handleClose();
    } catch (error) {
      throwToast("Error creating experience", "error");
    }
  };

  const submitEditExperience = async () => {
    try {
      const newExperience = {
        company: [
          {
            id: formData.id,
            logo: "",
            name: formData.name,
            startDate: new Date(formData.startDate),
            endDate: formData.isWorking
              ? new Date("")
              : new Date(formData.startDate),
            isWorking: formData.isWorking,
            position: formData.position,
            location: formData.location,
            description: formData.description,
            workingType: formData.workingType,
          },
        ],
      };
      await updateExperiences(newExperience);
      handleClose();
    } catch (error) {
      throwToast("Error updating experience", "error");
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
            {/* {uploadedImage && (
              <div>
                <p>Image uploaded successfully!</p>
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded Image"
                />
              </div>
            )} */}
            <p className="m-0 py-1 fw-600 font-xss">Company Name</p>
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
                  value={formData.position}
                  name="position"
                  onChange={handleChange}
                  placeholder="Please enter your industry name"
                />
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xss">Employment Type</p>
                <Select
                  value={formData.workingType}
                  onChange={handleSelectChange}
                  displayEmpty
                  style={{ width: "100%", height: "32px" }}
                >
                  <MenuItem value="" disabled>
                    Select Working Type
                  </MenuItem>
                  <MenuItem value="FULL_TIME">Full-Time</MenuItem>
                  <MenuItem value="PART_TIME">Part-Time</MenuItem>
                  <MenuItem value="CASUAL">Casual</MenuItem>
                  <MenuItem value="CONTRACT">Contractor</MenuItem>
                  <MenuItem value="SELF-EMPLOYED">Self-employed</MenuItem>
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
                    name="isWorking"
                    id="true"
                    value="true"
                    checked={formData.isWorking === true}
                    onChange={handleRadioChange}
                  />
                  <span className="m-2 py-1">True</span>
                </div>
                <div>
                  <input
                    className="py-1"
                    type="radio"
                    name="isWorking"
                    id="false"
                    value="false"
                    checked={formData.isWorking === false}
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
                <p className="m-0 py-1 fw-600 font-xss">Start Date</p>
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
              {!formData.isWorking && (
                <div style={{ width: "48.5%" }}>
                  <p className="m-0 py-1 fw-600 font-xss">End Date</p>
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
            <p className="m-0 py-1 fw-600 font-xss">Location</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                height: "32px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              value={formData.location}
              name="location"
              onChange={handleChange}
              placeholder="Please enter your location"
            />
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
              () => console.log(formData)
              // isEditing
              //   ? () => submitEditExperience
              //   : () => submitAddExperience()
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
