"use client";

import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import styles from "@/styles/modules/createProfile.module.scss";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import useAuthStore, { type IUserSessionStore } from "@/store/auth";
import Image from "next/image";
import { createProfileRequest } from "@/api/onboard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface FormValues {
  nickName: string;
  location: string;
  isBroker: Boolean;
  email: string;
}
interface FormErrors {
  nickName?: string;
  location?: string;
  isBroker?: string;
  email?: string;
}

export default function CreateProfileForm(props: {
  regions: any[];
  onNext: () => void;
}) {
  const { session: authSession, updateProfile } = useAuthStore(
    (state: IUserSessionStore) => state,
  );
  // const lastName = authSession.user.lastName || "";
  // const firstName = authSession.user.firstName || "";
  // const email = authSession?.user.email;
  // const photo = authSession?.user?.photo.path;
  // const nickName = authSession?.userProfile.nickName;
  // Get data from local storage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "{}");
  const lastName = userInfo?.session?.user?.lastName || "";
  const firstName = userInfo?.session?.user?.firstName || "";
  const email = userInfo?.session?.user?.email;
  const photo = userInfo?.session?.user?.photo?.path;
  const nickName = userInfo?.session?.userProfile?.nickName;

  // Toast notification
  const throwToast = (message: string, notiType: string) => {
    const notiConfig: ToastOptions = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const notify = () => {
      if (message !== "" && notiType === "success") {
        toast.success(message, notiConfig);
      } else if (message !== "" && notiType === "error") {
        toast.error(message, notiConfig);
      }
    };

    notify();
  };

  // Form validation
  const validate = (values: FormValues) => {
    const errors: FormErrors = {};
    if (!values.location) {
      errors.location = "Please choose a location.";
    }
    if (values.isBroker === null) {
      errors.isBroker = "Please choose the user type.";
    }

    if (!nickName) {
      if (!values.nickName) {
        errors.nickName = "Please fill out a valid nickname.";
      } else if (values.nickName.length > 20 || values.nickName.length < 8) {
        errors.nickName = "Nick name must be between 8 and 20 characters.";
      }
    }
    if (!email) {
      if (!values.email) {
        errors.email = "Please fill out a valid email.";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      nickName: "",
      location: "",
      isBroker: false,
      email: "",
    },
    validate,
    onSubmit: async (values, { setFieldError }) => {
      if (nickName) values.nickName = nickName;
      if (email) values.email = email;

      const profileValues = {
        nickName: values.nickName?.toLowerCase().trim(),
        location: values.location?.toLowerCase().trim(),
        email: values.email?.toLowerCase().trim(),
        isBroker: values.isBroker === true ? true : false,
        isOnboarding: true,
      };

      try {
        await createProfileRequest(profileValues);
        const successMessage = "Your profile has been updated.";
        throwToast(successMessage, "success");
        // Save data in auth store
        updateProfile(values);
        // Continue the onboarding process
        localStorage.setItem("onboarding_step", "create_profile");
        setTimeout(() => {
          props.onNext();
        }, 4000);
      } catch (err) {
        console.log(err);
        // const errors = err as AxiosError;
        let errorMessage = "";
        const errorCode = err.code || err.statusCode;
        if (errorCode === "ER1018") {
          errorMessage = "Nickname already exists.";
          setFieldError("nickName", errorMessage);
          throwToast(errorMessage, "error");
        } else if (errorCode === "ER3013") {
          errorMessage = "You're not a whitelisted broker.";
          setFieldError("isBroker", errorMessage);
          throwToast(errorMessage, "error");
        } else if (errorCode === "ER1010") {
          errorMessage = "User profile already existed.";
          setFieldError("nickName", errorMessage);
          throwToast(errorMessage, "error");
        }
      } finally {
        // stop loading
      }
    },
  });

  return (
    <>
      <div className="card-body p-lg-5 p-4 w-100 border-0 ">
        <div className="row justify-content-center">
          <div className="col-lg-4 text-center">
            <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
              <Image
                src={photo ? photo : "/assets/images/user.png"}
                width={50}
                height={50}
                objectFit="cover"
                alt="avatar"
                className="shadow-sm rounded-circle"
              />
            </figure>
            <h2 className="fw-700 font-sm text-grey-900 mt-3">
              {firstName + " " + lastName}
            </h2>
            {/* <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">
              Brooklyn
            </h4> */}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* eslint-disable-next-line */}
          <label className="fw-600 mb-1" htmlFor="nickName">
            Nickname
          </label>
          <input
            className={`${formik.touched.nickName && formik.errors.nickName ? " border-danger" : ""} form-control`}
            name="nickName"
            id="nickName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={nickName ? nickName : formik.values.nickName}
            disabled={nickName ? true : false}
          />
          {formik.touched.nickName && formik.errors.nickName ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.nickName}
            </FormHelperText>
          ) : null}

          {/* eslint-disable-next-line */}
          <label className="fw-600 mt-3 mb-1">Region</label>
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
              // onInputChange={(e, newInputValue) => {
              //   setRegionInputValue(newInputValue);
              // }}
              onBlur={formik.handleBlur}
              sx={{
                "& fieldset": {
                  border: "2px #eee solid",
                  borderRadius: "10px",
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
            Email
          </label>
          <input
            type="email"
            className={`${formik.touched.email && formik.errors.email ? " border-danger" : ""} form-control`}
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={email ? email : formik.values.email}
            disabled={email ? true : false}
          />
          {formik.touched.email && formik.errors.email ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.email}
            </FormHelperText>
          ) : null}

          {/* eslint-disable-next-line */}

          <div></div>
          <label className="fw-600 mt-3 mb-3">User type</label>
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
                <i className="bi bi-person h2 m-0"></i>I am an Investor
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
                <i className="bi bi-person-check h2 m-0"></i>I am a Broker
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
            Continue
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}
