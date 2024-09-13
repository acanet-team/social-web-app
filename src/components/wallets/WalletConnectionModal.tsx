import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/walletConnectionModal.module.scss";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useWeb3 } from "@/context/wallet.context";
import { useConnectWallet } from "@web3-onboard/react/dist/hooks/useConnectWallet";

function WalletConnectionModal(props: {
  show: boolean;
  handleClose: () => void;
}) {
  const { show, handleClose } = props;
  const tWallet = useTranslations("Wallet");
  const { connectWallet, rateContract, account } = useWeb3();
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const [
    {
      wallet, // the wallet that has been connected or null if not yet connected
      connecting, // boolean indicating if connection is in progress
    },
    connect, // function to call to initiate user to connect wallet
    disconnect, // function to call to with wallet<DisconnectOptions> to disconnect wallet
  ] = useConnectWallet();

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
    if (wallet) {
      console.log("wallet 1111", wallet);
      handleClose();
    }
  }, [wallet]);

  const onConnectWalletHandler = () => {
    if (!account) {
      connectWallet();
      console.log("wallet", wallet);
      return;
    }
  };
  return (
    <Modal
      id={styles["wallet-modal"]}
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
        <i className="bi bi-wallet-fill h3 m-0 me-2"></i>
        <span className="fs-3 fw-bold">{tWallet("connect_wallet")}</span>
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
          <div
            className={`${styles["connect-wallet_btn"]} d-flex gap-2 shadow-xss align-items-center`}
            onClick={onConnectWalletHandler}
          >
            <Image
              src="/assets/images/wallet/metamask.png"
              width={20}
              height={20}
              alt="metamask wallet"
            />
            <span>MetaMask</span>
          </div>
          <div
            className={`${styles["connect-wallet_btn"]} d-flex gap-2 shadow-xss align-items-center`}
            onClick={onConnectWalletHandler}
          >
            <Image
              src="/assets/images/wallet/binance.png"
              width={20}
              height={20}
              alt="binance wallet"
            />
            <span>Binance Chain Wallet</span>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div
            className={`${styles["connect-wallet_btn"]} d-flex gap-2 shadow-xss align-items-center`}
            onClick={onConnectWalletHandler}
          >
            <Image
              src="/assets/images/wallet/coinbase.png"
              width={20}
              height={20}
              alt="coinbase wallet"
            />
            <span>Coinbase Wallet</span>
          </div>
          <div
            className={`${styles["connect-wallet_btn"]} d-flex gap-2 shadow-xss align-items-center`}
            onClick={onConnectWalletHandler}
          >
            <Image
              src="/assets/images/wallet/walletconnect.png"
              width={20}
              height={20}
              alt="wallet connect"
            />
            <span>WalletConnect</span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WalletConnectionModal;
