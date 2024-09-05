import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "@/styles/modules/profile.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import ImageUpload from "@/components/ImageUpload";
import { getProfile, updateProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import WaveLoader from "../WaveLoader";
import type { BrokerProfile } from "@/api/profile/model";
import { S3_GROUP_AVATAR, S3_GROUP_BANNER } from "@/utils/const";

function ModalEditBanner(props: {
  id: string;
  title: string;
  show: boolean;
  dataBrokerProfile: BrokerProfile;
  avatar: string;
  coverImg: string;
  handleClose: () => void;
}) {
  const { title, show, handleClose, id, avatar, coverImg } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isEditing, setIsEditing] = useState(true);
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

  const submitBanner = async () => {
    setIsLoading(true);
    try {
      const formDt = new FormData();
      if (uploadedCoverImage) {
        console.log("Uploading cover image", uploadedCoverImage);
        formDt.append("coverImage", uploadedCoverImage);
      }
      if (uploadedAvatarImage) {
        console.log("Uploading avatar image", uploadedAvatarImage);
        formDt.append("avatar", uploadedAvatarImage);
      }
      const dataUpdate = await updateProfile(formDt);
      console.log("ahsfa", dataUpdate);
      // window.location.reload();
      // await getProfile(id as string);
      handleClose();
      throwToast("About updated successfully", "success");
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
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
                  folderUpload={S3_GROUP_AVATAR}
                  onChange={(e) => setUploadedAvatarImage(e)}
                  aspect={119 / 119}
                  uploadAvatar={true}
                  previewImage={avatar}
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
                  previewImage={coverImg}
                  uploadAvatar={false}
                  folderUpload={S3_GROUP_BANNER}
                  aspect={1075 / 250}
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
