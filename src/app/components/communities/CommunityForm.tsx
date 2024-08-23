import React, { useEffect, useState, type ReactNode } from "react";
import styles from "@/styles/modules/modalTemplate.module.scss";
import classes from "@/styles/modules/createProfile.module.scss";
import { useFormik } from "formik";
import { throwToast } from "@/utils/throw-toast";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import type { ICommunity } from "@/types";
import * as Yup from "yup";
import { useLoading } from "@/context/Loading/context";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { title } from "process";
import ImageUpload from "@/components/ImageUpload";
import { S3_GROUP_BANNER } from "@/utils/const";

interface CommunityFormProps {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
}

const CommunityForm: React.FC<CommunityFormProps> = ({
  handleClose,
  handleShow,
  show,
  title,
}) => {
  const t = useTranslations("Community");
  const [groupInfo, setgroupInfo] = useState<ICommunity>({} as ICommunity);
  const { showLoading, hideLoading } = useLoading();
  const [fee, setFee] = useState<string>("");
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

  const formik = useFormik({
    initialValues: {
      name: groupInfo.name,
      description: groupInfo.description,
      hasFee: groupInfo.hasFee,
      feeNum: Number(groupInfo.feeNum),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required(t("error_missing_community_name"))
        .min(4, () => t("error_invalid_community_name"))
        .max(40, () => t("error_invalid_community_name")),
      description: Yup.string()
        .required(t("error_missing_description"))
        .min(4, () => t("error_invalid_description"))
        .max(250, () => t("error_invalid_description")),
      feeNum: Yup.number()
        .required(t("error_missing_fee"))
        .transform((value) =>
          isNaN(value) || value === null || value === undefined ? 0 : value,
        )
        .min(0.01, () => t("error_joining_fee")),
    }),
    onSubmit: async (values, { setFieldError }) => {
      const communityData = {
        name: values.name?.toLowerCase().trim(),
        description: values.description?.toLowerCase().trim(),
        hasFee: values.hasFee === true ? true : false,
        feeNum: Number(values.feeNum),
      };
      try {
        showLoading();
        // await createProfileRequest(profileValues);
        // const successMessage = "Your profile has been updated.";
        // throwToast(successMessage, "success");
        // Save data in auth store
        // updateProfile(values);
      } catch (err) {
        console.log(err);
      } finally {
        hideLoading();
      }
    },
  });

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
        {/* Content */}
        <form onSubmit={formik.handleSubmit}>
          <ImageUpload folderUpload={S3_GROUP_BANNER} onChange={console.log} />
          <label className="fw-600 mb-1" htmlFor="name">
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
            className={`${formik.touched.description && formik.errors.description ? " border-danger" : ""} w-100 rounded-xxl text-dark border-light-md fw-400 theme-dark-bg d-flex`}
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
          <label className="fw-600 mt-3 mb-3">{t("group_type")}</label>
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
                defaultChecked
                onChange={(e) => formik.setFieldValue("hasFee", false)}
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
                onChange={(e) => formik.setFieldValue("hasFee", true)}
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
                type="number"
                value={formik.values.feeNum}
                inputProps={{
                  step: "0.01",
                }}
                onBlur={(e) =>
                  formik.setFieldValue(
                    "feeNum",
                    Number(e.target.value).toFixed(2),
                  )
                }
                onChange={(e) => formik.setFieldValue("feeNum", e.target.value)}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                  className: `${formik.touched.hasFee && formik.errors.hasFee ? "border-danger" : ""}`,
                }}
                sx={{
                  fieldset: { border: "2px solid rgb(241, 241, 241)" },
                }}
              />
              {formik.errors.feeNum ? (
                <FormHelperText sx={{ color: "error.main" }}>
                  {JSON.stringify(formik.errors.feeNum).replace(/^"|"$/g, "")}
                </FormHelperText>
              ) : null}
            </div>
          )}
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
  );
};

export default React.memo(CommunityForm);
