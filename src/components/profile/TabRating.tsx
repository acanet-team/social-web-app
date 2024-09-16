import type { User, UserProfile } from "@/api/profile/model";
import styles from "@/styles/modules/tabRating.module.scss";
import { FormHelperText, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Ratings from "../Ratings";
import { useWeb3 } from "@/context/wallet.context";
import { useSession } from "next-auth/react";
import { useLoading } from "@/context/Loading/context";
import { throwToast } from "@/utils/throw-toast";
import { ethers } from "ethers";
import convertBigNumber from "@/utils/conver-bigNumber";

export default function TabRating(props: { brokerData: User }) {
  const { brokerData } = props;
  const { connectWallet, rateContract, account } = useWeb3();
  const { showLoading, hideLoading } = useLoading();
  const { data: session } = useSession();
  const [raterNickname, setRaterNickname] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const tRating = useTranslations("Rating");
  const brokerId = brokerData.id;

  useEffect(() => {
    console.log(session);
    if (session) {
      setRaterNickname(session?.user?.userProfile?.nickName);
    }
  }, [session]);

  useEffect(() => {
    const getAllRatings = async () => {
      try {
        // Get rating
        const res = await rateContract.getAllRatingsByBroker(
          brokerId?.toString(),
          20,
          0,
        );
        console.log("ressss", res[0]);
        setReviews(res[0]);
      } catch (err) {
        console.log(err);
      }
    };
    console.log("fetching");
    connectWallet();
    getAllRatings();
  }, [brokerId]);

  const formik = useFormik({
    initialValues: {
      rating: 0,
      review: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      rating: Yup.number().min(1, tRating("error_missing_rating")),
    }),
    onSubmit: async (values, { resetForm, setValues }) => {
      connectWallet();
      try {
        showLoading();
        const res = await rateContract.createRating(
          values.review,
          brokerId?.toString(),
          raterNickname?.toString(),
          values.rating,
          {
            from: account?.address,
            gasPrice: ethers.utils.parseUnits("100", "gwei"),
            gasLimit: 2000000,
          },
        );
        setReviewSubmitted(true);
      } catch (error) {
        throwToast(tRating("reivew_fail"), "error");
        console.error(error);
      } finally {
        hideLoading();
        resetForm({ rating: 0, review: "" } as any);
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
          {reviewSubmitted && <div>{tRating("review_submitted")}</div>}
          <Box className="d-flex align-items-center mb-3">
            <Rating
              name="rating"
              onChange={(event, newValue) => {
                formik.setFieldValue("rating", newValue);
              }}
              value={formik.values.rating}
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
              value={formik.values.review}
              placeholder={tRating("write_review")}
              multiline
              rows={4}
              name={"review"}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("review", event.target.value);
              }}
              sx={{
                border: "none",
                "& fieldset": { border: "1px solid #eee" },
                borderRadius: "5px",
              }}
            />
          </Box>
          {formik.touched.rating && (
            <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
              {formik.errors.rating}
            </FormHelperText>
          )}
          <button
            type="submit"
            className={`${reviewSubmitted ? styles["submit-btn_disable"] : ""} main-btn border-0 mt-3`}
            disabled={reviewSubmitted ? true : false}
          >
            {reviewSubmitted
              ? tRating("review_submitted")
              : tRating("submit_review")}
          </button>
          {reviewSubmitted && (
            <div className="text-grey-600 mt-3 text-center">
              You have submited a review for{" "}
              {brokerData.firstName + " " + brokerData.lastName} on{" "}
              {new Date().toLocaleString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
              and it cannot be altered
            </div>
          )}
        </form>
      </div>
      {/* Review list section */}
      <div
        className={`${styles["tab-rating-list__container"]} d-flex flex-column shadow-xss align-items-center`}
      >
        {reviews?.length === 0 && (
          <div className="text-grey-600 mt-3 text-center">
            {tRating("no_rating_found")}
          </div>
        )}
        {reviews?.length > 0 &&
          reviews.map((review) => (
            <div
              key={review[0]}
              className="d-flex flex-column justify-content-start align-items-start w-100"
            >
              <div className={`${styles["review_date"]} text-grey-600 fw-600`}>
                {convertBigNumber(review.timestamp).toLocaleString()}
              </div>
              <Ratings rating={review[5]} size={18} />
              <div className="d-flex align-items-center mt-2">
                <Image
                  src={"/assets/images/user.png"}
                  width={40}
                  height={40}
                  alt="test"
                  className={styles["review-avatar"]}
                />
                <div className={`${styles["review-name"]} ms-3 fw-bold`}>
                  {review[4]}
                </div>
              </div>
              <div className="text-grey-500 mt-2 mb-2">Investor</div>
              <div className={styles["review-desc"]}>{review[1]}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
