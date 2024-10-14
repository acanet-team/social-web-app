import { FormHelperText, TextField } from "@mui/material";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/sellNFTModal.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";
import { onSellNFT } from "@/api/nft";
import { throwToast } from "@/utils/throw-toast";
import { ethers } from "ethers";
import "dotenv/config";

interface SellNFTModalProps {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow?: () => void;
  nft: any;
}

const SellNFTModal: React.FC<SellNFTModalProps> = ({
  title,
  show,
  handleClose,
  handleShow,
  nft,
}) => {
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("NFT");
  const {
    nftMarketContract,
    nftContract,
    connectWallet,
    account,
    connectedChain,
  } = useWeb3();

  const validationSchema = Yup.object({
    content: Yup.string().required(t("error_content_missing")),
    price: Yup.number()
      .required(t("error_price_missing"))
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
      try {
        setIsLoading(true);
        const sellNft = await nftMarketContract.listNFTForSale(
          nft.token_id,
          ethers.utils.parseEther(values.price).toString(),
          {
            from: account?.address,
            gasLimit: process.env.NEXT_PUBLIC_NFT_GAS_LIMIT,
          },
        );
        sellNft.wait();
        const approve = await nftContract.approve(
          nftMarketContract.address,
          nft.token_id,
          {
            from: account?.address,
            gasLimit: process.env.NEXT_PUBLIC_NFT_GAS_LIMIT,
          },
        );
        approve.wait();
        await onSellNFT({
          content: values.content,
          nftContract: nftMarketContract.address,
          nftTokenId: nft.token_id,
          price: +values.price,
          currency: connectedChain?.id === "0x780c" ? "MOVE" : "BSC",
          quantity: 1,
          asset: nft.image_url,
        });

        handleClose();
        throwToast(t("sell_nft_success"), "success");
      } catch (error) {
        console.log(error);
        throwToast(t("sell_nft_error"), "error");
        setIsLoading(false);
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
        <div className="w-100 d-flex justify-content-center">
          <h2 className="p-0 m-0 fs-4 fw-bold">{title}</h2>
        </div>
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        <form onSubmit={formik.handleSubmit}>
          {/* Content */}
          <label className="fw-600 mt-3 mb-1" htmlFor="content">
            {t("sell_content")}
          </label>
          <textarea
            className={`${formik.touched.content && formik.errors.content ? " border-danger" : ""} w-100 rounded-3 text-dark border-light-md fw-400 theme-dark-bg d-flex`}
            name="content"
            id="content"
            rows={5}
            maxLength={500}
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
            <label className="fw-600 mt-3 mb-1">{t("sell_price")}</label>
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
                t("sell_confirm")
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SellNFTModal;
