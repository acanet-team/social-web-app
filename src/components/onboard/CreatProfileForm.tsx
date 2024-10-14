import type { IUser } from "@/api/auth/auth.model";
import {
  createProfileRequest,
  whiteListBrokerAdditionalData,
} from "@/api/onboard";
import { useLoading } from "@/context/Loading/context";
import styles from "@/styles/modules/createProfile.module.scss";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { throwToast } from "@/utils/throw-toast";
import { useTranslations } from "next-intl";
import type { InfoAdditionalBroker } from "@/api/onboard/model";
import { useMediaQuery } from "react-responsive";

export default function CreateProfileForm(props: {
  regions: any[];
  onNext: () => void;
  setCheckEmailIsWhiteList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session, update: updateSession } = useSession();
  const { showLoading, hideLoading } = useLoading();
  const [userInfo, setUserInfo] = useState<IUser>({} as IUser);
  const t = useTranslations("CreateProfile");
  const tOnboard = useTranslations("Onboard");
  const [emailIsWhiteList, setEmailIsWhiteList] = useState<boolean>(true);
  const isQuery = useMediaQuery({ query: "(max-width: 650px" });
  const groupPlatform = [
    "X",
    "Telegram",
    "Zalo",
    "Facebook",
    "Tiktok",
    "Youtube",
  ];
  const [listGroupPlatform, setlistGroupPlatform] = React.useState<string[]>(
    [],
  );
  const [createProfileInfo, setCreateProfileInfo] = useState<any>({});

  useEffect(() => {
    if (session) {
      setUserInfo({
        ...session.user,
        fullName: `${session?.user?.lastName || ""} ${
          session?.user?.firstName || ""
        }`,
        avatar: session.user.photo?.path || "/assets/images/user.png",
      });
      // setEmailIsWhiteList(session.user.isBroker)
    }
  }, [session]);

  const errorFieldMap: { [key: string]: string } = {
    ER1018: "nickName",
    ER3013: "isBroker",
    ER1010: "nickName",
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const urlFormat = /^((http|https):\/\/)?[^ "]+$/;

  const additionalForm = useFormik({
    initialValues: {
      contactEmail: "",
      phoneNumber: "",
      yearExperience: "",
      yourCompany: "",
      note: "",
      urlX: "",
      numMembersX: "",
      urlTele: "",
      numMembersTele: "",
      urlZalo: "",
      numMembersZalo: "",
      urlFacebook: "",
      numMembersFacebook: "",
      urlTiktok: "",
      numMembersTiktok: "",
      urlYoutube: "",
      numMembersYoutube: "",
      listGroupPlatform: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      note: Yup.string().max(200, () => t("error_note")),
      // yearExperience: Yup.number(),
      phoneNumber: Yup.string()
        .required(t("error_missing_phone"))
        .matches(phoneRegExp, t("Phone_number_is_not_valid")),
      yourCompany: Yup.string(),
      contactEmail: Yup.string()
        .required(t("error_missing_email"))
        .email(t("error_invalid_email")),
      listGroupPlatform: Yup.array().min(1, t("error_select_at_least_one")),
      urlX: Yup.string().test(
        "is-required-url",
        "URL is required and must be valid",
        function (value) {
          const { listGroupPlatform } = this.parent;
          if (listGroupPlatform && listGroupPlatform.includes("X")) {
            if (!value) {
              return this.createError({ message: t("error_url_missing") });
            }
            const isValidUrl = Yup.string().url().isValidSync(value);
            const isFormatValid = urlFormat.test(value);

            if (!isValidUrl || !isFormatValid) {
              return this.createError({
                message: t("error_url_type"),
              });
            }
          }
          return true;
        },
      ),
      numMembersX: Yup.number().typeError(t("error_num_members")),

      urlFacebook: Yup.string().test(
        "is-required-url",
        "URL is required and must be valid",
        function (value) {
          const { listGroupPlatform } = this.parent;
          if (listGroupPlatform && listGroupPlatform.includes("Facebook")) {
            if (!value) {
              return this.createError({ message: t("error_url_missing") });
            }
            const isValidUrl = Yup.string().url().isValidSync(value);
            const isFormatValid = urlFormat.test(value);

            if (!isValidUrl || !isFormatValid) {
              return this.createError({
                message: t("error_url_type"),
              });
            }
          }
          return true;
        },
      ),
      numMembersFacebook: Yup.number().typeError(t("error_num_members")),
      urlZalo: Yup.string().test(
        "is-required-url",
        "URL is required and must be valid",
        function (value) {
          const { listGroupPlatform } = this.parent;
          if (listGroupPlatform && listGroupPlatform.includes("Zalo")) {
            if (!value) {
              return this.createError({ message: t("error_url_missing") });
            }
            const isValidUrl = Yup.string().url().isValidSync(value);
            const isFormatValid = urlFormat.test(value);

            if (!isValidUrl || !isFormatValid) {
              return this.createError({
                message: t("error_url_type"),
              });
            }
          }
          return true;
        },
      ),
      numMembersZalo: Yup.number().typeError(t("error_num_members")),
      urlTele: Yup.string().test(
        "is-required-url",
        "URL is required and must be valid",
        function (value) {
          const { listGroupPlatform } = this.parent;
          if (listGroupPlatform && listGroupPlatform.includes("Telegram")) {
            if (!value) {
              return this.createError({ message: t("error_url_missing") });
            }
            const isValidUrl = Yup.string().url().isValidSync(value);
            const isFormatValid = urlFormat.test(value);

            if (!isValidUrl || !isFormatValid) {
              return this.createError({
                message: t("error_url_type"),
              });
            }
          }
          return true;
        },
      ),
      numMembersTele: Yup.number().typeError(t("error_num_members")),
      urlTiktok: Yup.string().test(
        "is-required-url",
        "URL is required and must be valid",
        function (value) {
          const { listGroupPlatform } = this.parent;
          if (listGroupPlatform && listGroupPlatform.includes("Tiktok")) {
            if (!value) {
              return this.createError({ message: t("error_url_missing") });
            }
            const isValidUrl = Yup.string().url().isValidSync(value);
            const isFormatValid = urlFormat.test(value);

            if (!isValidUrl || !isFormatValid) {
              return this.createError({
                message: t("error_url_type"),
              });
            }
          }
          return true;
        },
      ),
      numMembersTiktok: Yup.number().typeError(t("error_num_members")),
      urlYoutube: Yup.string().test(
        "is-required-url",
        "URL is required and must be valid",
        function (value) {
          const { listGroupPlatform } = this.parent;
          if (listGroupPlatform && listGroupPlatform.includes("Youtube")) {
            if (!value) {
              return this.createError({ message: t("error_url_missing") });
            }
            const isValidUrl = Yup.string().url().isValidSync(value);
            const isFormatValid = urlFormat.test(value);

            if (!isValidUrl || !isFormatValid) {
              return this.createError({
                message: t("error_url_type"),
              });
            }
          }
          return true;
        },
      ),
      numMembersYoutube: Yup.number().typeError(t("error_num_members")),
    }),
    onSubmit: async (values, { setFieldError }) => {
      const profileValues: InfoAdditionalBroker = {
        email: values.contactEmail?.toLowerCase().trim(),
        phone: values.phoneNumber?.toLowerCase().trim(),
        socialMedia: [],
        note: values.note,
        companyName: values.yourCompany,
        experience: values.yearExperience,
      };

      if (values.urlX.trim() !== "") {
        profileValues.socialMedia.push({
          name: "X",
          mediaUrl: values.urlX,
          totalMembers: Number(values.numMembersX),
        });
      }

      if (values.urlTele.trim() !== "") {
        profileValues.socialMedia.push({
          name: "Telegram",
          mediaUrl: values.urlTele,
          totalMembers: Number(values.numMembersTele),
        });
      }

      if (values.urlZalo.trim() !== "") {
        profileValues.socialMedia.push({
          name: "Zalo",
          mediaUrl: values.urlZalo,
          totalMembers: Number(values.numMembersZalo),
        });
      }

      if (values.urlFacebook.trim() !== "") {
        profileValues.socialMedia.push({
          name: "Facebook",
          mediaUrl: values.urlFacebook,
          totalMembers: Number(values.numMembersFacebook),
        });
      }

      if (values.urlTiktok.trim() !== "") {
        profileValues.socialMedia.push({
          name: "Tiktok",
          mediaUrl: values.urlTiktok,
          totalMembers: Number(values.numMembersTiktok),
        });
      }

      if (values.urlYoutube.trim() !== "") {
        profileValues.socialMedia.push({
          name: "Youtube",
          mediaUrl: values.urlYoutube,
          totalMembers: Number(values.numMembersYoutube),
        });
      }

      try {
        showLoading();
        await createProfileRequest(createProfileInfo);
        await whiteListBrokerAdditionalData(profileValues);
        localStorage.setItem("onboarding_step", "create_profile");
        props.onNext();
      } catch (err) {
        const errorCode = err.code || err.statusCode;
        const errorMsg = err.message || "Something goes wrong.";
        if (errorCode === "ER1024") {
          throwToast(t("error_email_whitelist"), "error");
        }
        const field = errorFieldMap[errorCode];
        if (field) {
          setFieldError(field, errorMsg);
          throwToast(errorMsg, "error");
        }
      } finally {
        hideLoading();
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      nickName: userInfo.nickName,
      location: userInfo.location,
      isBroker: userInfo.isBroker,
      email: userInfo.email,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nickName: Yup.string()
        .required(t("error_missing_nickname"))
        .matches(/^[a-zA-Z0-9_]+$/, t("error_invalid_characters"))
        .min(8, () => t("error_invalid_nickname"))
        .max(20, () => t("error_invalid_nickname")),
      location: Yup.string().required(t("error_location")),
      isBroker: Yup.bool().required(t("error_user_type")),
      email: Yup.string()
        .required(t("error_missing_email"))
        .email(t("error_invalid_email")),
    }),
    onSubmit: async (values, { setFieldError }) => {
      const profileValues = {
        nickName: values.nickName?.toLowerCase().trim(),
        location: values.location?.toLowerCase().trim(),
        email: values.email?.toLowerCase().trim(),
        isBroker: values.isBroker === true ? true : false,
        isOnboarding: true,
      };

      try {
        showLoading();
        if (userInfo.isBroker === false && values.isBroker === true) {
          setCreateProfileInfo(profileValues);
          setEmailIsWhiteList(false);
          props.setCheckEmailIsWhiteList(false);
        } else {
          const res = await createProfileRequest(profileValues);
          if (res) {
            setEmailIsWhiteList(true);
            localStorage.setItem("onboarding_step", "create_profile");
            const successMessage = "Your profile has been updated.";
            throwToast(successMessage, "success");
            props.onNext();
          }
          // updateProfile(values);
        }
        // const successMessage = "Your profile has been updated.";
        // throwToast(successMessage, "success");
        // Save data in auth store
        // updateProfile(values);
      } catch (err) {
        const errorCode = err.code || err.statusCode;
        const errorMsg = err.message || "Something goes wrong.";
        const field = errorFieldMap[errorCode];
        if (field) {
          setFieldError(field, errorMsg);
          throwToast(errorMsg, "error");
        }
      } finally {
        hideLoading();
      }
    },
  });

  const renderIconGroup = (social: string) => {
    if (social === "Facebook") {
      return (
        <div
          style={{ width: "16px", height: "16px", backgroundColor: "white" }}
        >
          <Image
            className="mb-2"
            src="/assets/images/317727_facebook_social media_social_icon.svg"
            width={16}
            height={16}
            alt=""
          />
        </div>
      );
    } else if (social === "X") {
      return (
        <div
          style={{ width: "16px", height: "16px", backgroundColor: "white" }}
        >
          <Image
            className="mb-2"
            src="/assets/images/11244080_x_twitter_elon musk_twitter_logo_icon.svg"
            width={14}
            height={14}
            alt=""
          />
        </div>
      );
    } else if (social === "Telegram") {
      return (
        <div
          style={{ width: "16px", height: "16px", backgroundColor: "white" }}
        >
          <Image
            className="mb-2"
            src="/assets/images/4102591_applications_media_social_telegram_icon.svg"
            width={16}
            height={16}
            alt=""
          />
        </div>
      );
    } else if (social === "Zalo") {
      return (
        <div
          style={{ width: "16px", height: "16px", backgroundColor: "white" }}
        >
          <Image
            className="mb-2"
            src="/assets/images/7044033_zalo_icon.svg"
            width={16}
            height={16}
            alt=""
          />
        </div>
      );
    } else if (social === "Tiktok") {
      return (
        <div
          style={{ width: "16px", height: "16px", backgroundColor: "white" }}
        >
          <Image
            className="mb-2"
            src="/assets/images/4362958_tiktok_logo_social media_icon.svg"
            width={16}
            height={16}
            alt=""
          />
        </div>
      );
    } else if (social === "Youtube") {
      return (
        <div
          style={{ width: "16px", height: "16px", backgroundColor: "white" }}
        >
          <Image
            className="mb-2"
            src="/assets/images/317714_video_youtube_icon.svg"
            width={16}
            height={16}
            alt=""
          />
        </div>
      );
    }

    return null;
  };

  const handleChange = (event: SelectChangeEvent<typeof listGroupPlatform>) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    setlistGroupPlatform(selectedValues);
    additionalForm.setFieldValue("listGroupPlatform", selectedValues);
  };

  const handleBack = () => {
    setEmailIsWhiteList(true);
    props.setCheckEmailIsWhiteList(true);
  };
  // console.log(`list`, additionalForm.errors);

  return (
    <>
      {emailIsWhiteList ? (
        <div className="card-body p-lg-5 p-4 w-100 border-0 ">
          <div className="row justify-content-center">
            <div className="col-lg-4 text-center">
              <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                <Image
                  src={userInfo.avatar}
                  width={50}
                  height={50}
                  objectFit="cover"
                  alt="avatar"
                  className="shadow-sm rounded-circle"
                />
              </figure>
              <h2 className="fw-700 font-sm text-grey-900 mt-3">
                {userInfo.fullName}
              </h2>
              {/* <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">
              Brooklyn
            </h4> */}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} id={styles["create-profile"]}>
            <label className="fw-600 mb-1" htmlFor="nickName">
              Nickname
              <span className="text-red">*</span>
            </label>
            <input
              className={`${formik.touched.nickName && formik.errors.nickName ? " border-danger" : ""} ${styles["form-control"]}`}
              name="nickName"
              id="nickName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nickName}
            />
            {formik.touched.nickName && formik.errors.nickName ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.nickName}
              </FormHelperText>
            ) : null}

            {/* eslint-disable-next-line */}
            <label className="fw-600 mt-3 mb-1">
              {t("region")}
              <span className="text-red">*</span>
            </label>
            <FormControl
              fullWidth
              id="location"
              error={formik.touched.location && Boolean(formik.errors.location)}
            >
              <Autocomplete
                id="location"
                options={props.regions}
                value={formik.values.location}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>,
                  newValue: string | null,
                ) => formik.setFieldValue("location", newValue)}
                onBlur={formik.handleBlur}
                sx={{
                  "& fieldset": {
                    border: "1px solid rgb(196, 196, 196)",
                    borderRadius: "10px",
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    padding: 0,
                  },
                  "& .MuiInputBase-input": {
                    padding: "6px 12px !important",
                    fontSize: "16px",
                    color: "rgba(17, 17, 17, 0.7843137255)",
                    height: "50px",
                    boxSizing: "border-box",
                  },
                  "& .MuiSelect-icon": {
                    color: "#ddd",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      formik.touched.location && Boolean(formik.errors.location)
                    }
                  />
                )}
              />

              {formik.touched.location && (
                <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
                  {formik.errors.location}
                </FormHelperText>
              )}
            </FormControl>

            {/* eslint-disable-next-line */}
            <label className="fw-600 mt-3 mb-1" htmlFor="email">
              Email<span className="text-red">*</span>
            </label>
            <input
              type="email"
              className={`${formik.touched.email && formik.errors.email ? " border-danger" : ""} ${styles["form-control"]}`}
              name="email"
              id="email"
              disabled
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {formik.errors.email}
              </FormHelperText>
            ) : null}

            {/* eslint-disable-next-line */}
            <label className="fw-600 mt-3 mb-3">
              {t("user_type")}
              <span className="text-red">*</span>
            </label>
            <div
              id={styles["profile-radio"]}
              className="profile-radio-btn mx-auto"
            >
              <div className="w-100">
                <input
                  type="radio"
                  name="isBroker"
                  id="investor"
                  value="false"
                  defaultChecked
                  onChange={(e) => formik.setFieldValue("isBroker", false)}
                />
                <label htmlFor="investor">
                  <i className="bi bi-person h2 m-0"></i>
                  {t("investor")}
                </label>
              </div>
              <div className="w-100">
                <input
                  type="radio"
                  name="isBroker"
                  id="broker"
                  value="true"
                  onChange={(e) => formik.setFieldValue("isBroker", true)}
                />
                <label htmlFor="broker">
                  <i className="bi bi-person-check h2 m-0"></i>
                  {t("broker")}
                </label>
              </div>
            </div>
            {formik.errors.isBroker ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {JSON.stringify(formik.errors.isBroker).replace(/^"|"$/g, "")}
              </FormHelperText>
            ) : null}

            <button
              type="submit"
              id={styles["profile-btn"]}
              className="main-btn bg-current text-center text-white fw-600 p-3 w175 border-0 d-inline-block mt-5"
            >
              {tOnboard("continue")}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="card-body p-lg-5 p-4 w-100 border-0 ">
            <form
              onSubmit={additionalForm.handleSubmit}
              id={styles["create-profile__not-whitelist"]}
            >
              <div className="d-flex justify-content-between">
                <div style={{ width: isQuery ? "49%" : "70%" }}>
                  <label
                    className={`fw-600 mt-3  ${isQuery ? "font-xsss" : ""}`}
                    htmlFor="contactEmail"
                  >
                    {t("Contact_Email")}
                    <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    className={`${additionalForm.touched.contactEmail && additionalForm.errors.contactEmail ? " border-danger" : ""} ${styles["form-control"]}`}
                    name="contactEmail"
                    id="contactEmail"
                    onChange={additionalForm.handleChange}
                    onBlur={additionalForm.handleBlur}
                    value={additionalForm.values.contactEmail}
                  />
                  {additionalForm.touched.contactEmail &&
                  additionalForm.errors.contactEmail ? (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {additionalForm.errors.contactEmail}
                    </FormHelperText>
                  ) : null}
                </div>
                <div style={{ width: isQuery ? "49%" : "28%" }}>
                  <label
                    className={`fw-600 mt-3 ${isQuery ? "font-xsss" : ""}`}
                    htmlFor="phoneNumber"
                  >
                    {t("Phone_number")}
                    <span className="text-red">*</span>
                  </label>
                  <input
                    className={`${additionalForm.touched.phoneNumber && additionalForm.errors.phoneNumber ? " border-danger" : ""} ${styles["form-control"]}`}
                    name="phoneNumber"
                    id="phoneNumber"
                    onChange={additionalForm.handleChange}
                    onBlur={additionalForm.handleBlur}
                    value={additionalForm.values.phoneNumber}
                  />
                  {additionalForm.touched.phoneNumber &&
                  additionalForm.errors.phoneNumber ? (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {additionalForm.errors.phoneNumber}
                    </FormHelperText>
                  ) : null}
                </div>
              </div>

              <div style={{ width: isQuery ? "100%" : "70%" }}>
                <label
                  className={`fw-600 mt-3 ${isQuery ? "font-xsss" : ""}`}
                  htmlFor="phoneNumber"
                >
                  {t("Select_your_group_platform")}
                  <span className="text-red">*</span>
                </label>

                <FormGroup sx={{ m: 0, width: "100%", border: "none" }}>
                  <Select
                    style={{ border: "none", backgroundColor: "white" }}
                    className="form-control bg-white"
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={listGroupPlatform}
                    onChange={handleChange}
                    renderValue={(selected) => (
                      <div
                        style={{ display: "flex", gap: "8px" }}
                        className="mt-1"
                      >
                        {selected.map((social) => renderIconGroup(social))}
                      </div>
                    )}
                  >
                    {groupPlatform.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox
                          checked={listGroupPlatform.indexOf(name) > -1}
                        />
                        <div className="d-flex">
                          <label className="fw-400 mt-1" htmlFor="name">
                            {renderIconGroup(name)}
                          </label>
                          <span className="mb-0 mx-3">{name}</span>
                        </div>
                        {/* <ListItemText primary={name} /> */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormGroup>
                {additionalForm.touched.listGroupPlatform &&
                additionalForm.errors.listGroupPlatform ? (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {additionalForm.errors.listGroupPlatform}
                  </FormHelperText>
                ) : null}
              </div>

              {listGroupPlatform.includes("X") && (
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ width: isQuery ? "49%" : "70%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      URL X<span className="text-red">*</span>
                    </label>
                    <input
                      className={`${additionalForm.touched.urlX && additionalForm.errors.urlX ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="urlX"
                      id="urlX"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.urlX}
                      placeholder="X"
                    />
                    {additionalForm.touched.urlX &&
                    additionalForm.errors.urlX ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.urlX}
                      </FormHelperText>
                    ) : null}
                  </div>
                  <div style={{ width: isQuery ? "49%" : "28%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor="phoneNumber"
                    >
                      {t("Number_of_members")}
                    </label>
                    <input
                      className={`${additionalForm.touched.numMembersX && additionalForm.errors.numMembersX ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="numMembersX"
                      id="numMembersX"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.numMembersX}
                      placeholder="X"
                    />
                    {additionalForm.touched.numMembersX &&
                    additionalForm.errors.numMembersX ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.numMembersX}
                      </FormHelperText>
                    ) : null}
                  </div>
                </div>
              )}
              {listGroupPlatform.includes("Zalo") && (
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ width: isQuery ? "49%" : "70%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      URL Zalo
                      <span className="text-red">*</span>
                    </label>
                    <input
                      className={`${additionalForm.touched.urlZalo && additionalForm.errors.urlZalo ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="urlZalo"
                      id="urlZalo"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.urlZalo}
                      placeholder="Zalo"
                    />
                    {additionalForm.touched.urlZalo &&
                    additionalForm.errors.urlZalo ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.urlZalo}
                      </FormHelperText>
                    ) : null}
                  </div>
                  <div style={{ width: isQuery ? "49%" : "28%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor="phoneNumber"
                    >
                      {t("Number_of_members")}
                    </label>
                    <input
                      className={`${additionalForm.touched.numMembersZalo && additionalForm.errors.numMembersZalo ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="numMembersZalo"
                      id="numMembersZalo"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.numMembersZalo}
                      placeholder="Zalo"
                    />
                    {additionalForm.touched.numMembersZalo &&
                    additionalForm.errors.numMembersZalo ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.numMembersZalo}
                      </FormHelperText>
                    ) : null}
                  </div>
                </div>
              )}
              {listGroupPlatform.includes("Telegram") && (
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ width: isQuery ? "49%" : "70%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      URL Telegram
                      <span className="text-red">*</span>
                    </label>
                    <input
                      className={`${additionalForm.touched.urlTele && additionalForm.errors.urlTele ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="urlTele"
                      id="urlTele"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.urlTele}
                      placeholder="Telegram"
                    />
                    {additionalForm.touched.urlTele &&
                    additionalForm.errors.urlTele ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.urlTele}
                      </FormHelperText>
                    ) : null}
                  </div>
                  <div style={{ width: isQuery ? "49%" : "28%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor="phoneNumber"
                    >
                      {t("Number_of_members")}
                    </label>
                    <input
                      className={`${additionalForm.touched.numMembersTele && additionalForm.errors.numMembersTele ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="numMembersTele"
                      id="numMembersTele"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.numMembersTele}
                      placeholder="Telegram"
                    />
                    {additionalForm.touched.numMembersTele &&
                    additionalForm.errors.numMembersTele ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.numMembersTele}
                      </FormHelperText>
                    ) : null}
                  </div>
                </div>
              )}
              {listGroupPlatform.includes("Facebook") && (
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ width: isQuery ? "49%" : "70%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      URL Facebook
                      <span className="text-red">*</span>
                    </label>
                    <input
                      className={`${additionalForm.touched.urlFacebook && additionalForm.errors.urlFacebook ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="urlFacebook"
                      id="urlFacebook"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.urlFacebook}
                      placeholder="Facebook"
                    />
                    {additionalForm.touched.urlFacebook &&
                    additionalForm.errors.urlFacebook ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.urlFacebook}
                      </FormHelperText>
                    ) : null}
                  </div>
                  <div style={{ width: isQuery ? "49%" : "28%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor="phoneNumber"
                    >
                      {t("Number_of_members")}
                    </label>
                    <input
                      className={`${additionalForm.touched.numMembersFacebook && additionalForm.errors.numMembersFacebook ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="numMembersFacebook"
                      id="numMembersFacebook"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.numMembersFacebook}
                      placeholder="Facebook"
                    />
                    {additionalForm.touched.numMembersFacebook &&
                    additionalForm.errors.numMembersFacebook ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.numMembersFacebook}
                      </FormHelperText>
                    ) : null}
                  </div>
                </div>
              )}
              {listGroupPlatform.includes("Tiktok") && (
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ width: isQuery ? "49%" : "70%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      URL Tiktok<span className="text-red">*</span>
                    </label>
                    <input
                      className={`${additionalForm.touched.urlTiktok && additionalForm.errors.urlTiktok ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="urlTiktok"
                      id="urlTiktok"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.urlTiktok}
                      placeholder="Tiktok"
                    />
                    {additionalForm.touched.urlTiktok &&
                    additionalForm.errors.urlTiktok ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.urlTiktok}
                      </FormHelperText>
                    ) : null}
                  </div>
                  <div style={{ width: isQuery ? "49%" : "28%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor="phoneNumber"
                    >
                      {t("Number_of_members")}
                    </label>
                    <input
                      className={`${additionalForm.touched.numMembersTiktok && additionalForm.errors.numMembersTiktok ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="numMembersTiktok"
                      id="numMembersTiktok"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.numMembersTiktok}
                      placeholder="Tiktok"
                    />
                    {additionalForm.touched.numMembersTiktok &&
                    additionalForm.errors.numMembersTiktok ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.numMembersTiktok}
                      </FormHelperText>
                    ) : null}
                  </div>
                </div>
              )}
              {listGroupPlatform.includes("Youtube") && (
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ width: isQuery ? "49%" : "70%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      URL Youtube<span className="text-red">*</span>
                    </label>
                    <input
                      className={`${additionalForm.touched.urlYoutube && additionalForm.errors.urlYoutube ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="urlYoutube"
                      id="urlYoutube"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.urlYoutube}
                      placeholder="Youtube"
                    />
                    {additionalForm.touched.urlYoutube &&
                    additionalForm.errors.urlYoutube ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.urlYoutube}
                      </FormHelperText>
                    ) : null}
                  </div>
                  <div style={{ width: isQuery ? "49%" : "28%" }}>
                    <label
                      className={`fw-600 ${isQuery ? "font-xsss" : ""}`}
                      htmlFor=""
                    >
                      {t("Number_of_members")}
                    </label>
                    <input
                      className={`${additionalForm.touched.numMembersYoutube && additionalForm.errors.numMembersYoutube ? "border-danger" : ""} ${styles["form-control"]}`}
                      name="numMembersYoutube"
                      id="numMembersYoutube"
                      onChange={additionalForm.handleChange}
                      onBlur={additionalForm.handleBlur}
                      value={additionalForm.values.numMembersYoutube}
                      placeholder="Youtube"
                    />
                    {additionalForm.touched.numMembersYoutube &&
                    additionalForm.errors.numMembersYoutube ? (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {additionalForm.errors.numMembersYoutube}
                      </FormHelperText>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between">
                <div style={{ width: isQuery ? "49%" : "70%" }}>
                  <label
                    className={`fw-600 mt-3 mb-1 ${isQuery ? "font-xsss" : ""}`}
                    htmlFor="yourCompany"
                  >
                    {t("Your_company")}
                  </label>
                  <input
                    className={`${additionalForm.touched.yourCompany && additionalForm.errors.yourCompany ? " border-danger" : ""} ${styles["form-control"]}`}
                    name="yourCompany"
                    id="yourCompany"
                    onChange={additionalForm.handleChange}
                    onBlur={additionalForm.handleBlur}
                    value={additionalForm.values.yourCompany}
                  />
                  {additionalForm.touched.yourCompany &&
                  additionalForm.errors.yourCompany ? (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {additionalForm.errors.yourCompany}
                    </FormHelperText>
                  ) : null}
                </div>
                <div style={{ width: isQuery ? "49%" : "28%" }}>
                  <label
                    className={`fw-600 mt-3 mb-1 ${isQuery ? "font-xsss" : ""}`}
                    htmlFor="yearExperience"
                  >
                    {t("Years_of_Experience")}
                  </label>
                  <input
                    className={`${additionalForm.touched.yearExperience && additionalForm.errors.yearExperience ? " border-danger" : ""} ${styles["form-control"]}`}
                    name="yearExperience"
                    id="yearExperience"
                    onChange={additionalForm.handleChange}
                    onBlur={additionalForm.handleBlur}
                    value={additionalForm.values.yearExperience}
                  />
                  {additionalForm.touched.yearExperience &&
                  additionalForm.errors.yearExperience ? (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {additionalForm.errors.yearExperience}
                    </FormHelperText>
                  ) : null}
                </div>
              </div>

              <label
                className={`fw-600 mt-3 mb-1 ${isQuery ? "font-xsss" : ""}`}
                htmlFor="note"
              >
                {t("Note")}
              </label>
              <textarea
                className={`${additionalForm.touched.note && additionalForm.errors.note ? " border-danger" : ""} ${styles["form-control"]}`}
                style={{ height: "100px" }}
                name="note"
                id="note"
                onChange={additionalForm.handleChange}
                onBlur={additionalForm.handleBlur}
                value={additionalForm.values.note}
              />
              {additionalForm.touched.note && additionalForm.errors.note ? (
                <FormHelperText sx={{ color: "error.main" }}>
                  {additionalForm.errors.note}
                </FormHelperText>
              ) : null}

              <div className="d-flex justify-content-center mt-3">
                <button
                  onClick={() => handleBack()}
                  type="button"
                  id={styles["profile-btn"]}
                  className="main-btn bg-tumblr text-center text-white  fw-600 p-3 w175 border-0 mt-5"
                >
                  {tOnboard("previous")}
                </button>
                <button
                  type="submit"
                  id={styles["profile-btn"]}
                  className="main-btn bg-current text-center text-white fw-600 p-3 w175 border-0 mt-5"
                >
                  {tOnboard("continue")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
