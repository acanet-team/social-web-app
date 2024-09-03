import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import style from "@/styles/modules/profile.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import ImageUpload from "@/components/ImageUpload";
import { updateProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import WaveLoader from "../WaveLoader";

function ModalEditBanner(props: {
  title: string;
  show: boolean;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  setCoverImg: React.Dispatch<React.SetStateAction<string>>;
  handleClose: () => void;
  // handleShow: () => void;
}) {
  const { title, show, handleClose, setAvatar, setCoverImg } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const [uploadedCoverImage, setUploadedCoverImage] = useState<File | null>(
    null,
  );
  const [uploadedAvatarImage, setUploadedAvatarImage] = useState<File | null>(
    null,
  );

  const submitBanner = useCallback(async () => {
    setIsLoading(true);
    try {
      const formDt = new FormData();
      if (uploadedCoverImage) {
        formDt.append("coverImage", uploadedCoverImage);
      }
      if (uploadedAvatarImage) {
        formDt.append("avatar", uploadedAvatarImage);
      }
      const dataUpdate = await updateProfile(formDt);
      console.log("ahsfa", dataUpdate);
      // setAvatar(dataUpdate.avatar)
      // setCoverImg(dataUpdate.coverImage)
      handleClose();
      throwToast("About updated successfully", "success");
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
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
          {/* <ImageUpload folderUpload={""} onChange={function (file: File): void {
          throw new Error("Function not implemented.");
        } } /> */}
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
              </div>

              <div className={style["style-img"]}>
                <ImageUpload
                  folderUpload={""}
                  onChange={(e) => setUploadedAvatarImage(e)}
                  aspect={1}
                  uploadAvatar={true}
                  previewImage={"avatar"}
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
              </div>

              <div className={style["style-img"]}>
                <ImageUpload
                  previewImage={"coverImg"}
                  uploadAvatar={false}
                  folderUpload={""}
                  aspect={960 / 250}
                  onChange={(e) => setUploadedCoverImage(e)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={submitBanner}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
}

export default ModalEditBanner;
