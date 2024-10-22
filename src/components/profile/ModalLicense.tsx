import React, { useCallback, useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import {
  FormHelperText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ImageUpload from "@/components/ImageUpload";
import dayjs from "dayjs";
import { throwToast } from "@/utils/throw-toast";
import { createNewLicense, updateLicense } from "@/api/profile";
import WaveLoader from "../WaveLoader";
import type { BaseArrayResponse, BaseResponse } from "@/api/model";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { License } from "@/api/profile/model";

interface ModalLisenceProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  isEditing: boolean;
  formDt: License;
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>;
}

export const ModalLicense: React.FC<ModalLisenceProp> = ({
  handleClose,
  isEditing,
  show,
  title,
  formDt,
  setLicenses,
}) => {
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
  const t = useTranslations("MyProfile");
  // const [formData, setFormData] = useState(formDt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBlur = (field: string) => (event: React.FocusEvent<any>) => {
    formik.handleBlur(event);
  };

  const formik = useFormik({
    initialValues: {
      licenseType: isEditing ? formDt.licenseType : "",
      licenseIssuer: isEditing ? formDt.licenseIssuer : "",
      licenseIssueDate: isEditing
        ? formDt.licenseIssueDate
          ? dayjs(formDt.licenseIssueDate)
          : null
        : null,
      licenseExpirationDate: isEditing
        ? formDt.licenseExpirationDate
          ? dayjs(formDt.licenseExpirationDate)
          : null
        : null,
      licenseStatus: isEditing ? formDt.licenseStatus : "",
      credentialID: isEditing ? formDt.credentialID : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      licenseType: Yup.string().required(t("error_missing_license_type")),
      licenseIssueDate: Yup.date().required(t("error_missing_issue_date")),
      licenseExpirationDate: Yup.date()
        .nullable()
        .required(t("error_missing_expiration_date"))
        .when("licenseIssueDate", (licenseIssueDate, schema) => {
          return licenseIssueDate
            ? schema.min(
                licenseIssueDate,
                t("error_expiration_before_issue_date"),
              )
            : schema;
        }),
      licenseStatus: Yup.string().required(t("error_missing_status")),
    }),
    onSubmit: async (values) => {
      const license = {
        ...(isEditing && { id: formDt.id }),
        licenseType: values.licenseType,
        logo: "",
        licenseIssuer: values.licenseIssuer,
        licenseIssueDate: new Date(String(values.licenseIssueDate)),
        licenseStatus: values.licenseStatus,
        licenseExpirationDate: values.licenseExpirationDate
          ? new Date(String(values.licenseExpirationDate))
          : new Date(""),
        credentialID: values.credentialID,
      };
      const newLicense = {
        licenses: [license],
      };
      console.log("New License", newLicense);
      try {
        setIsLoading(true);
        if (isEditing) {
          await updateLicense(newLicense);
          setLicenses((prev) =>
            prev.map((cer) =>
              cer.id === license.id ? { newLicense, ...cer } : cer,
            ),
          );
        } else {
          const res: BaseArrayResponse<License> =
            await createNewLicense(newLicense);
          if (res.data) {
            setLicenses((prev) => {
              const createdLicense: License = res.data[0] as License;
              return [createdLicense, ...prev];
            });
          }
        }

        handleClose();
      } catch (error) {
        throwToast("Error creating/updating license", "error");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className={`${styles["customModal"]} font-system`}
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
          <form className="p-1" onSubmit={formik.handleSubmit}>
            {/* <ImageUpload
              folderUpload={""}
              onChange={handleImageChange}
              aspect={0}
              uploadAvatar={false}
              previewImage={""}
            /> */}
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">
                  {t("name")} {t("certification")}
                </p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formik.values.licenseType}
                  name="licenseType"
                  onChange={(e) => {
                    formik.setFieldValue("licenseType", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Please enter your license or certification name"
                />

                {formik.touched.licenseType && formik.errors.licenseType ? (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {formik.errors.licenseType}
                  </FormHelperText>
                ) : null}
              </div>

              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">
                  {t("Issuing Organization")}
                </p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.licenseIssuer}
                  name="licenseIssuer"
                  // onChange={handleChange}
                  onChange={(e) => {
                    formik.setFieldValue("licenseIssuer", e.target.value);
                  }}
                  placeholder="Please enter your issuing organization"
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs ">{t("Issued year")}</p>
                <DatePicker
                  disableFuture
                  className="w__100"
                  value={formik.values.licenseIssueDate}
                  onChange={(date) => {
                    formik.setFieldValue("licenseIssueDate", dayjs(date));
                  }}
                  slotProps={{
                    textField: {
                      onBlur: handleBlur("licenseIssueDate"),
                    },
                  }}
                  sx={{
                    width: "100%",
                    height: "56px",
                    "& fieldset": {
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    },
                  }}
                  views={["day", "month", "year"]}
                />

                {formik.touched.licenseIssueDate &&
                formik.errors.licenseIssueDate ? (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {formik.errors.licenseIssueDate}
                  </FormHelperText>
                ) : null}
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs ">
                  {t("Expiration year")}
                </p>
                <DatePicker
                  className="w__100"
                  value={formik.values.licenseExpirationDate}
                  onChange={(date) => {
                    formik.setFieldValue("licenseExpirationDate", dayjs(date));
                  }}
                  sx={{
                    width: "100%",
                    height: "56px",
                    "& fieldset": {
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    },
                  }}
                  views={["day", "month", "year"]}
                />
                {formik.touched.licenseExpirationDate &&
                formik.errors.licenseExpirationDate ? (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {formik.errors.licenseExpirationDate}
                  </FormHelperText>
                ) : null}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">{t("License Status")}</p>
                <Select
                  value={formik.values.licenseStatus}
                  onChange={(e) => {
                    formik.setFieldValue("licenseStatus", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  sx={{
                    width: "100%",
                    height: "56px",
                    "& fieldset": {
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("select")} {t("License Status")}
                  </MenuItem>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                  <MenuItem value="REVOKED">REVOKED</MenuItem>
                  <MenuItem value="EXPIRED">EXPIRED</MenuItem>
                </Select>
                {/* {errors.licenseStatus && (
                  <p className="text-red font-xsss ">{errors.licenseStatus}</p>
                )} */}
                {formik.touched.licenseStatus && formik.errors.licenseStatus ? (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {formik.errors.licenseStatus}
                  </FormHelperText>
                ) : null}
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">{t("Credential ID")}</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formik.values.credentialID}
                  name="credentialID"
                  onChange={(e) => {
                    formik.setFieldValue("credentialID", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Please enter your credential id"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              // onClick={
              //   isEditing ? () => submitEditLicense() : () => submitAddLicense()
              // }
              className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
            >
              {t("save")}
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}></Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
};
