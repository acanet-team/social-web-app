import React, { useState, type ReactNode } from "react";
import styles from "@/styles/modules/modal.module.scss";
import classes from "@/styles/modules/createProfile.module.scss";
import { useFormik } from "formik";
import { throwToast } from "@/utils/throw-toast";
import {
  FormHelperText,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { ICommunity } from "@/types";
import * as Yup from "yup";
import { useLoading } from "@/context/Loading/context";

interface CommunityFormProps {
  title: string;
  onCancel: () => void;
  onOk: () => void;
}

const CommunityForm: React.FC<CommunityFormProps> = ({
  onCancel,
  onOk,
  title,
}) => {
  const t = useTranslations("Community");
  const [groupInfo, setgroupInfo] = useState<ICommunity>({} as ICommunity);
  const { showLoading, hideLoading } = useLoading();
  const [fee, setFee] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      name: groupInfo.name,
      description: groupInfo.description,
      hasFee: groupInfo.hasFee,
      feeNum: groupInfo.feeNum,
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
      feeNum: Yup.number().required("error_missing_fee"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      // const profileValues = {
      //   nickName: values.nickName?.toLowerCase().trim(),
      //   location: values.location?.toLowerCase().trim(),
      //   email: values.email?.toLowerCase().trim(),
      //   isBroker: values.isBroker === true ? true : false,
      //   isOnboarding: true,
      // };
      // try {
      //   showLoading();
      //   await createProfileRequest(profileValues);
      //   const successMessage = "Your profile has been updated.";
      //   throwToast(successMessage, "success");
      //   // Save data in auth store
      //   // updateProfile(values);
      //   // Continue the onboarding process
      //   localStorage.setItem("onboarding_step", "create_profile");
      //   props.onNext();
      // } catch (err) {
      //   const errorCode = err.code || err.statusCode;
      //   const errorMsg = err.message || "Something goes wrong.";
      //   const field = errorFieldMap[errorCode];
      //   if (field) {
      //     setFieldError(field, errorMsg);
      //     throwToast(errorMsg, "error");
      //   }
      // } finally {
      //   hideLoading();
      // }
    },
  });

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]} id={styles["community-form"]}>
        <div className={styles["modal-header"]}>
          {/* <h5 className="fs-1 fw-bolder m-0">{title}</h5> */}
        </div>
        <button
          type="button"
          className="btn-close position-absolute right-15 top-10"
          onClick={onCancel}
        ></button>
        <form onSubmit={formik.handleSubmit}>
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
            className={`${formik.touched.description && formik.errors.description ? " border-danger" : ""} w-100 rounded-xxl text-dark fw-400 border-light-md theme-dark-bg`}
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
          <label className="fw-600 mt-2 mb-3">{t("group_type")}</label>
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
                <i className="bi bi-person h2 m-0"></i>
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
                <i className="bi bi-person-check h2 m-0"></i>
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
                value={fee}
                inputProps={{
                  step: "0.01",
                }}
                onBlur={() => setFee(Number(fee).toFixed(2))}
                onChange={(e) => setFee(e.target.value)}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                sx={{
                  fieldset: { border: "2px solid #ddd" },
                }}
              />
            </div>
          )}
          <button
            type="submit"
            id={classes["profile-btn"]}
            className="main-btn bg-current text-center text-white fw-600 p-3 w175 border-0 d-inline-block mt-5"
          >
            Continue
          </button>

          {/* <div className={classes["button-group"]}>
          <button onClick={onOk} className={classes["ok-button"]}>
            Save
          </button>
        </div> */}
        </form>
      </div>
    </div>
  );
};

export default React.memo(CommunityForm);
