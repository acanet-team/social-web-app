import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
} from "react";
import classes from "@/styles/modules/createProfile.module.scss";
import { useFormik } from "formik";
import { throwToast } from "@/utils/throw-toast";
import { FormHelperText, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import * as Yup from "yup";
import { useLoading } from "@/context/Loading/context";
import Modal from "react-bootstrap/Modal";
import { createCommunity, editCommunity, getACommunity } from "@/api/community";
import type { ICommunity } from "@/api/community/model";
import Image from "next/image";
import { ImageCropModal } from "@/components/ImageCropModal";
import styles from "@/styles/modules/communityForm.module.scss";
import { useWeb3 } from "@/context/wallet.context";
import { v4 as uuidV4 } from "uuid";
// import { uuid } from "uuidv4";
import { ethers } from "ethers";
import "dotenv/config";
import { group } from "console";

interface CommunityFormProps {
  isEditing: string;
  show: boolean;
  brokerId?: number;
  handleClose: () => void;
  handleShow?: () => void;
  setCommunities?: React.Dispatch<React.SetStateAction<ICommunity[]>>;
  setCommunity?: React.Dispatch<React.SetStateAction<ICommunity>>;
}

const CommunityForm: React.FC<CommunityFormProps> = ({
  handleClose,
  show,
  isEditing,
  brokerId,
  setCommunities,
  setCommunity,
}) => {
  const t = useTranslations("Community");
  const tProfile = useTranslations("MyProfile");
  const [groupInfo, setgroupInfo] = useState<ICommunity>({} as ICommunity);
  const { showLoading, hideLoading } = useLoading();
  const [uploadedCoverImage, setUploadedCoverImage] = useState<File | null>(
    null,
  );
  const [uploadedAvatarImage, setUploadedAvatarImage] = useState<File | null>(
    null,
  );
  const [previewCover, setPreviewCover] = useState<string>("");
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [openImageCrop, setOpenImageCrop] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  const { communityContract, account, connectedChain, connectWallet } =
    useWeb3();

  const fetchCommunity = async () => {
    try {
      showLoading();
      if (isEditing) {
        const response = await getACommunity(isEditing);
        setgroupInfo(response.data);
        setPreviewCover(response.data?.coverImage?.path);
        setPreviewAvatar(response.data?.avatar?.path);
        console.log("group data", response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    // Fetch group data
    fetchCommunity();
    const handleResize = () => {
      if (window) {
        setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (window) return window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("error_missing_community_name"))
      .min(4, () => t("error_invalid_community_name"))
      .max(40, () => t("error_invalid_community_name")),
    description: Yup.string()
      .required(t("error_missing_description"))
      .min(4, () => t("error_invalid_description"))
      .max(350, () => t("error_invalid_description")),
    hasFee: Yup.boolean(),
    feeNum: Yup.lazy((value, { parent }) =>
      parent.hasFee
        ? Yup.number()
            .transform((value) => (isNaN(value) ? 0 : Number(value)))
            .required(t("error_missing_fee"))
            .min(0.00001, t("error_joining_fee"))
        : Yup.mixed()
            .transform((value) => (isNaN(value) ? 0 : Number(value)))
            .notRequired(),
    ),
  });

  const formik = useFormik({
    initialValues: {
      name: isEditing ? groupInfo.name : "",
      description: isEditing ? groupInfo.description : "",
      hasFee: groupInfo.fee > 0 ? true : false,
      feeNum: isEditing ? Number(groupInfo.fee) : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const communityData = new FormData();
      communityData.append("name", values.name?.trim());
      communityData.append("description", values.description?.trim());
      communityData.append(
        "fee",
        values.hasFee ? String(Number(values.feeNum).toFixed(5)) : "0",
      );
      if (uploadedAvatarImage) {
        communityData.append("avatar", uploadedAvatarImage);
      }
      if (uploadedCoverImage) {
        communityData.append("coverImage", uploadedCoverImage);
      }
      if (isEditing) {
        communityData.append("communityId", isEditing);
      }
      if (values.hasFee && values.feeNum) {
        if (!account) {
          connectWallet();
          handleClose();
          return;
        }
      }
      try {
        // // Calling api to edit/create a community
        // if (isEditing) {
        //   const editedCommunity = await editCommunity(communityData);
        //   setCommunities &&
        //     setCommunities(
        //       (prev: ICommunity[]) =>
        //         prev.map((group: ICommunity) =>
        //           group.id === editedCommunity.data.id
        //             ? editedCommunity.data
        //             : group
        //         ) as ICommunity[]
        //     );
        //   setCommunity && setCommunity(editedCommunity.data);
        // } else {
        //   // Create group with fee on smart contract
        //   const groupId = uuidV4();
        //   communityData.append("id", groupId);
        //   if (values.hasFee && values.feeNum) {
        //     console.log(communityContract);
        //     console.log('feeeee', values.feeNum);
        //     console.log("group", groupId);
        //     console.log("broker", brokerId);
        //     console.log(
        //       "fee",
        //       ethers.utils.parseEther(values.feeNum.toString())
        //     );
        //     const newGroupContract = await communityContract.createGroup(
        //       groupId.toString(),
        //       brokerId?.toString(),
        //       ethers.utils.parseEther(values.feeNum.toString()).toString(),
        //       {
        //         from: account?.address,
        //       }
        //     );
        //     console.log("new group", newGroupContract);
        //     const communityHash = newGroupContract.hash;
        //     console.log('hash', communityHash);
        //     if (communityHash && connectedChain) {
        //       // console.log('connectedChain', connectedChain);
        //       communityData.append("hashTransaction", communityHash);
        //       communityData.append(
        //         "network",
        //         connectedChain.id === "0x780c" ? "30732" : "97"
        //       );
        //     }
        //     // const awaits = await newGroupContract.wait();
        //     // console.log(awaits);
        //   }
        //   // Create group on DB
        //   // console.log('to send', communityData);
        //   const newCommunity = await createCommunity(communityData);

        //   if (!values.hasFee) {
        //     throwToast("Community created", "success");
        //     setCommunities &&
        //       setCommunities(
        //         (prev) => [newCommunity.data, ...prev] as ICommunity[]
        //       );
        //   } else {
        //     throwToast("Your community is in review", "success");
        //   }
        // }
        // handleClose();

        // Editing community
        if (isEditing) {
          if (values.hasFee && values.feeNum) {
            communityContract.createGroup(
              groupInfo.id.toString(),
              brokerId?.toString(),
              ethers.utils.parseEther(values.feeNum.toString()).toString(),
              {
                from: account?.address,
              },
            );
          }
          const editedCommunity = await editCommunity(communityData);

          if (!values.hasFee) {
            setCommunities &&
              setCommunities(
                (prev: ICommunity[]) =>
                  prev.map((group: ICommunity) =>
                    group.id === editedCommunity.data.id
                      ? editedCommunity.data
                      : group,
                  ) as ICommunity[],
              );
            setCommunity && setCommunity(editedCommunity.data);
          }
        } else {
          // Creating comminity
          const groupId = uuidV4();
          communityData.append("id", groupId);
          if (values.hasFee && values.feeNum) {
            const newGroupContract = await communityContract.createGroup(
              groupId.toString(),
              brokerId?.toString(),
              ethers.utils.parseEther(values.feeNum.toString()).toString(),
              {
                from: account?.address,
              },
            );
            const test = newGroupContract.wait();
            console.log("newgroup", newGroupContract);
            console.log("newgroup2", test);
            const communityHash = newGroupContract.hash;
            console.log("old hash", communityHash);
            if (communityHash && connectedChain) {
              communityData.append("hashTransaction", communityHash);
              communityData.append(
                "network",
                connectedChain.id === "0x780c" ? "30732" : "97",
              );
            }
            // const awaits = await newGroupContract.wait();
            // console.log(awaits);
          }
          // Create group on DB
          // console.log('to send', communityData);
          const newCommunity = await createCommunity(communityData);

          if (!values.hasFee) {
            throwToast("Community created", "success");
            setCommunities &&
              setCommunities(
                (prev) => [newCommunity.data, ...prev] as ICommunity[],
              );
          } else {
            throwToast(t("community_created_success"), "success");
          }
        }
        handleClose();
      } catch (err) {
        console.log(err);
        throwToast(t("community_created_fail"), "error");
      } finally {
      }
    },
  });

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onloadend = () => resolve(reader.result as string);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = event.target.files as FileList;
    if (!file) {
      return;
    }
    try {
      setImageType(type);
      const imgUrl = await fileToDataString(file?.[0] as File);
      setSelectedImage(imgUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedImage && imageType) {
      setOpenImageCrop(true);
    }
  }, [selectedImage, imageType]);

  const onCropped = async (image: File) => {
    const imgUrl = await fileToDataString(image);
    if (imageType === "avatar") {
      setUploadedAvatarImage(image);
      setPreviewAvatar(imgUrl);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
    if (imageType === "cover") {
      setUploadedCoverImage(image);
      setPreviewCover(imgUrl);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
    setOpenImageCrop(false);
    setImageType(null);
    setSelectedImage("");
  };

  const onCancel = () => {
    setOpenImageCrop(false);
    if (imageType === "avatar") {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
    if (imageType === "cover") {
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
    setImageType(null);
    setSelectedImage("");
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
          />
        )}
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        {/* Content */}
        <form onSubmit={formik.handleSubmit}>
          {/* Images upload */}
          <div className="position-relative w-100 bg-image-cover bg-image-center">
            <Image
              src={
                previewCover
                  ? previewCover
                  : `/assets/images/default-upload.jpg`
              }
              width={960}
              height={250}
              alt="cover"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100px",
                borderRadius: "5px",
              }}
            />
            <label htmlFor="cover" className="cursor-pointer">
              <i
                className={`${styles["image-edit__btn"]} ${styles["cover-image-edit__btn"]} bi bi-pencil h3 m-0 position-absolute`}
              ></i>
            </label>
            <input
              id="cover"
              ref={coverInputRef}
              className="visually-hidden"
              type="file"
              onChange={(e) => handleFileChange(e, "cover")}
              accept="image/*"
              style={{ display: "none" }}
            />
            <figure
              className="avatar position-absolute w75 mb-0 z-index-1"
              style={{ left: "50px", bottom: "-50%" }}
            >
              <Image
                src={
                  previewAvatar
                    ? previewAvatar
                    : `/assets/images/profile/ava.png`
                }
                alt="avatar"
                width={100}
                height={100}
                className="float-right p-1 bg-white rounded-circle position-relative"
                style={{ objectFit: "cover", boxShadow: "0 0 2px 2px #eee" }}
              />
              <label htmlFor="avatar" className="cursor-pointer">
                <i
                  className={`${styles["image-edit__btn"]} ${styles["avatar-image-edit__btn"]} bi bi-pencil h3 m-0 position-absolute right-0 bottom-0`}
                ></i>
              </label>
              <input
                id="avatar"
                ref={avatarInputRef}
                className="visually-hidden"
                type="file"
                onChange={(e) => handleFileChange(e, "avatar")}
                accept="image/*"
                style={{ display: "none" }}
              />
            </figure>
          </div>
          {openImageCrop && (
            <ImageCropModal
              isOpen={openImageCrop}
              onCancel={onCancel}
              cropped={onCropped}
              imageUrl={selectedImage}
              aspect={imageType === "cover" ? 960 / 250 : 1}
            />
          )}

          {/* Form inputs */}
          <label
            className="fw-600 mb-1"
            htmlFor="name"
            style={{ marginTop: "70px" }}
          >
            {t("group_name")}
          </label>
          <input
            className={`${formik.touched.name && formik.errors.name ? " border-danger" : ""} form-control`}
            name="name"
            id="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.name}
            </FormHelperText>
          ) : null}

          <label className="fw-600 mt-3 mb-1" htmlFor="description">
            {t("group_desc")}
          </label>
          <textarea
            className={`${formik.touched.description && formik.errors.description ? " border-danger" : ""} w-100 rounded-3 text-dark border-light-md fw-400 theme-dark-bg d-flex`}
            name="description"
            id="description"
            rows={4}
            maxLength={250}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            style={{ resize: "none", marginBottom: "0" }}
          />
          {formik.touched.description && formik.errors.description ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.description}
            </FormHelperText>
          ) : null}

          {/* eslint-disable-next-line */}
          <label className="fw-600 mt-3 mb-1">{t("group_type")}</label>
          <div
            id={classes["profile-radio"]}
            className="profile-radio-btn mx-auto"
          >
            <div className="w-100">
              <input
                type="radio"
                name="hasFee"
                id="free"
                value="false"
                checked={formik.values.hasFee === false ? true : false}
                onChange={() => {
                  console.log(formik.values.hasFee);
                  formik.setFieldValue("hasFee", false);
                }}
              />
              <label htmlFor="free">
                <i className="bi bi-shield h2 m-0"></i>
                {t("free")}
              </label>
            </div>
            <div className="w-100">
              <input
                type="radio"
                name="hasFee"
                id="paid"
                value="true"
                checked={formik.values.hasFee === false ? false : true}
                onChange={() => formik.setFieldValue("hasFee", true)}
              />
              <label htmlFor="paid">
                <i className="bi bi-shield-check h2 m-0"></i>
                {t("paid")}
              </label>
            </div>
          </div>
          {formik.errors.hasFee ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {JSON.stringify(formik.errors.hasFee).replace(/^"|"$/g, "")}
            </FormHelperText>
          ) : null}

          {formik.values.hasFee && (
            <div className="d-flex flex-column g-0">
              <label className="fw-600 mt-3 mb-1">{t("joining_fee")}</label>
              <TextField
                type="string"
                name="feeNum"
                value={formik.values.feeNum}
                // inputProps={{
                //   min: 0,
                //   step: 0.01,
                // }}
                // placeholder={tProfile("donate_input")}
                // onBlur={(e) =>
                //   formik.setFieldValue(
                //     "feeNum",
                //     Number(e.target.value).toFixed(2)
                //   )
                // }
                // onBlur={(e) => formik.setFieldValue("feeNum", e.target.value)}
                onBlur={formik.handleBlur}
                // onChange={(e) => formik.setFieldValue("feeNum", e.target.value)}
                onChange={(e) =>
                  formik.setFieldValue(
                    "feeNum",
                    e.target.value.replace(/,/g, "."),
                  )
                }
                InputProps={{
                  style: {
                    borderRadius: "5px",
                  },
                  className: `${formik.touched.feeNum && formik.errors.feeNum ? "border-danger" : ""}`,
                }}
                sx={{
                  fieldset: { border: "2px solid rgb(241, 241, 241)" },
                }}
              />
              {formik.touched.feeNum && formik.errors.feeNum ? (
                <FormHelperText sx={{ color: "error.main" }}>
                  {JSON.stringify(formik.errors.feeNum).replace(/^"|"$/g, "")}
                </FormHelperText>
              ) : null}
            </div>
          )}
          <Modal.Footer className={styles["modal-footer"]}>
            <button
              type="submit"
              className="main-btn bg-current text-center text-white fw-600 rounded-3 p-3 w150 border-0 my-3 ms-auto"
            >
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(CommunityForm);
