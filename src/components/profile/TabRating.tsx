import type { User } from "@/api/profile/model";
import styles from "@/styles/modules/tabRating.module.scss";
import { FormHelperText, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import * as Yup from "yup";
import Ratings from "../Ratings";
import { useWeb3 } from "@/context/wallet.context";
import { useSession } from "next-auth/react";
import { error } from "console";
import { useLoading } from "@/context/Loading/context";

export default function TabRating(props: { brokerData: User }) {
  const { brokerData } = props;
  const tRating = useTranslations("Rating");
  const { connectWallet, rateContract, account } = useWeb3();
  const { showLoading, hideLoading } = useLoading();
  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      rating: 0,
      review: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      rating: Yup.number().min(1, tRating("error_missing_rating")),
    }),
    onSubmit: async (values, { setFieldError }) => {
      if (!account) {
        connectWallet();
        return;
      }
      try {
        showLoading();
        const txHash = await rateContract.createRating(
          "ahihi",
          "13",
          "duyht",
          5,
        );
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    },
  });

  return (
    <div style={{ marginBottom: "300px" }}>
      <div
        className={`${styles["tab-rating__container"]} d-flex flex-column align-items-center shadow-xss my-5`}
      >
        <div className="mb-3 text-current text-center">
          {tRating("review_input_title")}&nbsp;
          {brokerData.firstName + " " + brokerData.lastName}
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="w-100 d-flex flex-column align-items-center"
        >
          <Box className="d-flex align-items-center mb-3">
            <Rating
              name="rating"
              onChange={(event, newValue) => {
                formik.setFieldValue("rating", newValue);
              }}
              sx={{
                lineHeight: "0",
                width: "100%",
                fontSize: "40px",
                color: "#ffd700",
              }}
            />
          </Box>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
              width: "100%",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="review"
              placeholder={tRating("write_review")}
              multiline
              rows={4}
              name={"review"}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("review", event.target.value);
              }}
              sx={{
                backgroundColor: "#eee",
                border: "none",
                "& fieldset": { border: "none" },
                borderRadius: "5px",
              }}
            />
          </Box>
          {formik.touched.rating && (
            <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
              {formik.errors.rating}
            </FormHelperText>
          )}
          <button type="submit" className="main-btn border-0 mt-3">
            {tRating("submit_review")}
          </button>
        </form>
      </div>
      <div
        className={`${styles["tab-rating-list__container"]} d-flex flex-column shadow-xss align-items-center`}
      >
        <div className="d-flex flex-column justify-content-start">
          <div className={`${styles["review_date"]} text-grey-600 fw-600`}>
            Jan 20, 2024
          </div>
          <Ratings rating={3.5} size={18} />
          <div className="d-flex align-items-center mt-2">
            <Image
              src={"/assets/images/user.png"}
              width={40}
              height={40}
              alt="test"
              className={styles["review-avatar"]}
            />
            <div className={`${styles["review-name"]} ms-3 fw-bold`}>
              Alex K
            </div>
          </div>
          <div className="text-grey-500 mt-2 mb-3">Senior Analyst</div>
          <div className={styles["review-desc"]}>
            Test description Test description Test descriptio Test description
            Test description Test description Test description Test description.
          </div>
        </div>
      </div>
    </div>
  );
}
