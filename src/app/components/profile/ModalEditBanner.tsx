import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import style from "@/styles/modules/profile.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";

function ModalEditBanner(props: {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
}) {
  const { title, show, handleClose, handleShow } = props;
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [showUploadProfilePicture, setShowUploadProfilePicture] =
    useState(false);
  const [showUploadCoverPicture, setShowUploadCoverPicture] = useState(false);
  const [uploadProfilePicture, setUploadProfilePicture] = useState<File | null>(
    null,
  );
  const [uploadCoverPicture, setUploadCoverPicture] = useState<File | null>(
    null,
  );

  const toggleUploadProfilePicture = () => {
    setShowUploadProfilePicture(!showUploadProfilePicture);
  };

  const toggleUploadCoverPicture = () => {
    setShowUploadCoverPicture(!showUploadCoverPicture);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        setUploadProfilePicture(file);
      }
    }
  };
  const handleImageCoverUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        setUploadCoverPicture(file);
      }
    }
  };

  return (
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
        <div style={{ overflowY: "auto", maxHeight: "100%" }}>
          <div className="profile-picture">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h1 className="fw-800 font-md">Profile picture</h1>
              <div onClick={toggleUploadProfilePicture} className="">
                <i className="font-md text-success feather-image me-2"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="avatarUpload"
                  hidden={!showUploadProfilePicture}
                />
                <span>Edit</span>
              </div>
            </div>

            <div className={style["style-img"]}>
              <Image
                src={
                  uploadProfilePicture
                    ? URL.createObjectURL(uploadProfilePicture)
                    : "/assets/images/profile/ava.png"
                }
                alt="Uploaded Image"
                className={style["profile-img"]}
                layout="responsive"
                width={50}
                height={50}
                objectFit="cover"
              />
            </div>
          </div>
          <div className="cover-picture">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h1 className="fw-800 font-md">Cover Photo</h1>
              <div onClick={toggleUploadCoverPicture} className="">
                <i className="font-md text-success feather-image me-2"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageCoverUpload}
                  id="avatarUpload"
                  hidden={!showUploadCoverPicture}
                />
                <span className="">Edit</span>
              </div>
            </div>

            <div className={style["style-img"]}>
              <Image
                src={
                  uploadCoverPicture
                    ? URL.createObjectURL(uploadCoverPicture)
                    : "/assets/images/profile/u-bg.png"
                }
                alt="Uploaded Image"
                className={style["cover-img"]}
                layout="responsive"
                width={100}
                height={100}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
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
  );
}

export default ModalEditBanner;
