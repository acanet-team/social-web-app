import { FormHelperText, TextField } from "@mui/material";
import React, { useState } from "react";
import { ImageCropModal } from "../ImageCropModal";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/communityForm.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";
import { onSellNFT } from "@/api/nft";
import { throwToast } from "@/utils/throw-toast";

interface SellNFTModalProps {
  show: boolean;
  handleClose: () => void;
  handleShow?: () => void;
  nft: any;
}

const SellNFTModal: React.FC<SellNFTModalProps> = ({
  show,
  handleClose,
  handleShow,
  nft,
}) => {
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tNFT = useTranslations("NFT");
  const { nftContract, connectWallet, account, connectedChain } = useWeb3();

  const validationSchema = Yup.object({
    content: Yup.string().required(tNFT("error_content_missing")),
    price: Yup.number()
      .required(tNFT("error_price_missing"))
      .transform((originalValue, transformedValue) => {
        const numValue = Number(originalValue);
        return isNaN(numValue) ? 0 : numValue;
      }),
  });

  const formik = useFormik({
    initialValues: {
      content: "",
      price: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      console.log("aaa", values);
      try {
        console.log("fff", nft);

        await onSellNFT({
          content: values.content,
          nftContract: nftContract.address,
          nftTokenId: connectedChain?.id === "0x780c" ? "MOVE" : "BSC",
          price: +values.price,
          currency: "string",
          quantity: "1",
          asset: nft.image_url,
        });
        handleClose();
        throwToast(tNFT("sell_nft_success"), "success");
      } catch (error) {
        console.log(error);
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
          />
        )}
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        <form onSubmit={formik.handleSubmit}>
          {/* Content */}
          <label className="fw-600 mt-3 mb-1" htmlFor="content">
            {tNFT("sell_content")}
          </label>
          <textarea
            className={`${formik.touched.content && formik.errors.content ? " border-danger" : ""} w-100 rounded-3 text-dark border-light-md fw-400 theme-dark-bg d-flex`}
            name="content"
            id="content"
            rows={4}
            maxLength={250}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
            style={{ resize: "none", marginBottom: "0" }}
          />
          {formik.touched.content && formik.errors.content ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.content}
            </FormHelperText>
          ) : null}

          {/* Price */}
          <div className="d-flex flex-column g-0">
            <label className="fw-600 mt-3 mb-1">{tNFT("sell_price")}</label>
            <TextField
              type="string"
              name="price"
              value={formik.values.price}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, ".");
                const numericValue = value.replace(/[^0-9.]/g, "");
                formik.setFieldValue("price", numericValue);
              }}
              InputProps={{
                style: {
                  borderRadius: "5px",
                },
                className: `${formik.touched.price && formik.errors.price ? "border-danger" : ""}`,
              }}
              sx={{
                fieldset: { border: "2px solid rgb(241, 241, 241)" },
              }}
            />
            {formik.touched.price && formik.errors.price ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {JSON.stringify(formik.errors.price).replace(/^"|"$/g, "")}
              </FormHelperText>
            ) : null}
          </div>
          <Modal.Footer className={styles["modal-footer"]}>
            <button
              type="submit"
              disabled={isLoading ? true : false}
              className={`${isLoading ? "btn-loading" : "bg-current"} main-btn text-center text-white fw-600 rounded-3 p-3 w150 border-0 my-3 ms-auto`}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-md"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                tNFT("sell_confirm")
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SellNFTModal;
