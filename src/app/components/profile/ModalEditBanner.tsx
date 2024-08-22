import type { ModalProps } from "@/types/dto";
import React, { useRef, useState } from "react";
import styles from "@/styles/modules/modal.module.scss";
import classes from "@/styles/modules/createProfile.module.scss";
import Box from "@mui/material/Box";
import Image from "next/image";
import style from "@/styles/modules/createPost.module.scss";

const ModalEditBanner: React.FC<ModalProps> = ({ onCancel, onOk, title }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadProfilePicture, setUploadProfilePicture] = useState<File | null>(
    null,
  );
  const imageRef = useRef<HTMLInputElement>(null);

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        setUploadProfilePicture(file);
      }
    }
  };

  const removeImage = () => {
    setUploadProfilePicture(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]} id={styles["community-form"]}>
        <div className={styles["modal-header"]}>
          <h5 className="fs-1 fw-bolder m-0">{title}</h5>
        </div>
        <button
          type="button"
          className="btn-close position-absolute right-15 top-10"
          onClick={onCancel}
        ></button>
        <form>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <label className="">Profile picture</label>
              <label onClick={toggleUploadForm} className="">
                <i className="font-md text-success feather-image me-2"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="avatarUpload"
                  hidden={!showUploadForm}
                  ref={imageRef}
                />
                Edit profile picture
              </label>
            </div>
            <Box
              sx={{
                width: "100%",
                maxHeight: 500,
                overflow: "hidden",
              }}
            >
              <div className={style["previewImage"]}>
                <Image
                  src={
                    uploadProfilePicture
                      ? URL.createObjectURL(uploadProfilePicture)
                      : "/assets/images/profile/ava.png"
                  }
                  alt="Uploaded Image"
                  className={style["imagePreview"]}
                  layout="responsive"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
                {uploadProfilePicture && (
                  <i
                    className={`${style["remove-img"]} bi bi-x-circle-fill cursor-pointer`}
                    onClick={removeImage}
                  ></i>
                )}
              </div>
            </Box>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <label className="">Cover Photo</label>
              <label onClick={toggleUploadForm} className="">
                <i className="font-md text-success feather-image me-2"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="avatarUpload"
                  hidden={!showUploadForm}
                  ref={imageRef}
                />
                Edit cover photo
              </label>
            </div>
            <Box
              sx={{
                width: "100%",
                maxHeight: 500,
                overflow: "hidden",
              }}
            >
              <div className={style["previewImage"]}>
                <Image
                  src={
                    uploadProfilePicture
                      ? URL.createObjectURL(uploadProfilePicture)
                      : "/assets/images/profile/ava.png"
                  }
                  alt="Uploaded Image"
                  className={style["imagePreview"]}
                  layout="responsive"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
                {uploadProfilePicture && (
                  <i
                    className={`${style["remove-img"]} bi bi-x-circle-fill cursor-pointer`}
                    onClick={removeImage}
                  ></i>
                )}
              </div>
            </Box>
          </div>
        </form>
        <div className={classes["button-group"]}>
          <button type="button" onClick={onOk} className={classes["ok-button"]}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditBanner;
