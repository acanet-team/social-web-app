import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/donateModal.module.scss";
import { useTranslations } from "next-intl";
import { FormHelperText, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMediaQuery } from "react-responsive";
import { useWeb3 } from "@/context/wallet.context";
import type { User } from "@/api/profile/model";
import { useSession } from "next-auth/react";
import { throwToast } from "@/utils/throw-toast";
import { ethers } from "ethers";

function DonateModal(props: {
  show: boolean;
  handleClose: () => void;
  brokerData: User;
}) {
  const { show, handleClose, brokerData } = props;
  const t = useTranslations("MyProfile");
  const tWallet = useTranslations("Wallet");
  const defaultDonateOptions = [5, 10, 15];
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const [isDonateInputSelected, setIsDonateInputSelected] = useState(false);
  const { donateContract, connectWallet, account } = useWeb3();
  const { data: session } = useSession();
  const [donateUser, setDonateUser] = useState<string>("");

  useEffect(() => {
    if (session) {
      setDonateUser(session?.user?.userProfile?.nickName);
    }
  }, [session]);

  useEffect(() => {
    const handleResize = () => {
      if (window) {
        setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (window) {
        return window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (isDonateInputSelected) {
      formik.setFieldTouched("amount", false);
      formik.setFieldValue("amount", "");
    }
  }, [isDonateInputSelected]);

  const validationSchema = Yup.object({
    amount: Yup.lazy((value, { parent }) =>
      !parent.option
        ? Yup.number()
            .required(t("donate_amount_missing"))
            .transform((originalValue, transformedValue) => {
              // Convert string to number before validation
              const numValue = Number(originalValue);
              return isNaN(numValue) ? 0 : numValue;
            })
            .min(0.0000000001, t("donate_amount_missing"))
        : Yup.mixed().notRequired(),
    ),
  });

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("amount", values.amount);
        if (!account) {
          connectWallet();
          handleClose();
        }
        if (brokerData.wallet_address && donateUser) {
          await donateContract.donate(
            brokerData.wallet_address,
            brokerData.id.toString(),
            donateUser.toString(),
            {
              from: account?.address,
              gasLimit: 2000000,
              value: ethers.utils.parseEther(values.amount.toString()),
            },
          );
        }
        throwToast(tWallet("donate_success"), "success");
        handleClose();
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Modal
      id={styles["donate-modal"]}
      show={show}
      onHide={handleClose}
      centered
      maxWidth="500px"
      className={`${styles["customModal"]} nunito-font`}
    >
      <div className={isMobile ? styles["donate-content__mobile"] : ""}>
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
          <i className="bi bi-wallet-fill h3 m-0 me-2"></i>
          <span className="fs-3 fw-bold">{t("donate_amount")}</span>
        </Modal.Header>
        <Modal.Body className={styles["modal-content"]}>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles["donate-options"]}>
              {defaultDonateOptions.map((option, index) => (
                <div className={`${styles["donate-option"]} w-100`} key={index}>
                  <input
                    type="radio"
                    name="donate"
                    id={`${index}`}
                    value={option}
                    onChange={(e) => {
                      setIsDonateInputSelected(false);
                      console.log("a", e.target.value);
                      formik.setFieldValue("amount", Number(e.target.value));
                    }}
                  />
                  <label htmlFor={`${index}`}>
                    <i className="bi bi-cash-coin h2 m-0"></i>
                    {option}
                  </label>
                </div>
              ))}
              <div className={`${styles["donate-option"]} w-100`}>
                <input
                  key="self-input"
                  type="radio"
                  name="donate"
                  id="self-input"
                  onChange={(e) => {
                    setIsDonateInputSelected(true);
                  }}
                />
                <label htmlFor="self-input">
                  <i className="bi bi-cash-coin h2 m-0"></i>
                  {tWallet("input_donate_amount")}
                </label>
              </div>
            </div>

            {isDonateInputSelected && (
              <div>
                <TextField
                  type="number"
                  name="amount"
                  value={formik.values.amount}
                  // placeholder={t("donate_input")}
                  // onBlur={(e) =>
                  //   formik.setFieldValue(
                  //     "amount",
                  //     Number(Number(e.target.value).toFixed(2)),
                  //   )
                  // }
                  // onBlur={(e) =>
                  //   formik.setFieldValue(
                  //     "amount",
                  //     Number(Number(e.target.value))
                  //   )
                  // }
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue("amount", Number(e.target.value))
                  }
                  InputProps={{
                    style: {
                      borderRadius: "5px",
                    },
                    className: `${formik.touched.amount && formik.errors.amount ? "border-danger" : ""}`,
                  }}
                  sx={{
                    fieldset: { border: "2px solid rgb(241, 241, 241)" },
                    width: "100%",
                  }}
                />
                {formik.touched.amount && formik.errors.amount ? (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {JSON.stringify(formik.errors.amount).replace(/^"|"$/g, "")}
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
      </div>
    </Modal>
  );
}

export default DonateModal;
