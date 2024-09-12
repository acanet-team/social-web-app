import React, { useCallback, useState } from "react";
import WalletConnectionModal from "./WalletConnectionModal";
import { useWeb3 } from "@/context/wallet.context";

export default function Wallet() {
  const [openWallet, setOpenWallet] = useState<boolean>(false);
  const { connectWallet } = useWeb3();

  const handleClose = useCallback(() => {
    setOpenWallet(false);
  }, []);
  return (
    <div
      style={{ marginBottom: "300px" }}
      className="mt-5 d-flex flex-column align-items-center"
    >
      <h1 className="fs-3 text-grey-600 mb-4">Connect your wallet to Acanet</h1>
      <button
        className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block mx-auto"
        onClick={connectWallet}
      >
        Connect
      </button>
      {openWallet && (
        <WalletConnectionModal show={openWallet} handleClose={handleClose} />
      )}
    </div>
  );
}
