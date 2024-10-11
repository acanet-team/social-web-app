import type { User } from "@/api/profile/model";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DotWaveLoader from "../DotWaveLoader";
import { useSession } from "next-auth/react";
import { useWeb3 } from "@/context/wallet.context";
import axios from "axios";
import styles from "@/styles/modules/TabNftProfile.module.scss";
import { useTranslations } from "next-intl";
import SellNFTModal from "../nft/SellNFTModal";
import { onCancelSellNFT } from "@/api/nft";

const TabNftProfile = (props: {
  user: User;
  idParam: string;
  updateUserWallet: React.Dispatch<React.SetStateAction<void>>;
}) => {
  const tNFT = useTranslations("NFT");
  const { user, idParam, updateUserWallet } = props;
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nftData, setNftData] = useState<any[]>([]);
  const [nftToSell, setNftToSell] = useState<any>();
  const [nftTokenIdSell, setNftTokenIdSell] = useState<any[]>([]);

  const {
    nftContract,
    connectedChain,
    account,
    nftMarketContract,
    connectWallet,
  } = useWeb3();

  const getAllNFTs = async (address: string) => {
    setLoading(true);
    try {
      const res = await nftContract.getOwnedTokensByAddress(address);
      const nftDataPromises = res.map(async (url: string) => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/s3/` +
            url.replace(/https?:\/\/(www\.)?([^\/]+)/, ""),
        );
        return response.data;
      });
      const nftDataArray = await Promise.all(nftDataPromises);
      setNftData(nftDataArray);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllListedNFTs = async () => {
    setLoading(true);
    try {
      const res = await nftMarketContract.getAllListedNFTs();
      const nftTokenIds = res.map((elm: any) => elm.tokenId.toNumber());
      setNftTokenIdSell(nftTokenIds);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (session) {
      setId(session?.user?.id);
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (Number(idParam) === id) {
      setRole(true);
    }
  }, [idParam, id]);

  useEffect(() => {
    if (!account) {
      connectWallet();
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      updateUserWallet();
    }
  }, [account]);

  useEffect(() => {
    if (user.walletAddress) {
      getAllNFTs(user.walletAddress);
      getAllListedNFTs();
    }
  }, [user, user.walletAddress]);

  const onSellNFTHandler = (nft: any) => {
    setNftToSell(nft);
    setOpenModal(true);
  };
  const onCancelSellNFTHandler = async (tokenId: number) => {
    const cancelSellNFT = await nftMarketContract.cancelListing(tokenId, {
      from: account?.address,
      gasLimit: 2000000,
    });
    cancelSellNFT.wait();
    onCancelSellNFT(connectedChain?.id === "0x780c" ? "MOVE" : "BSC", tokenId);
  };
  return (
    <>
      <div className="row">
        <div className="col-xl-12 col-12">
          <div className="card p-0 border-0 shadow-xss rounded-3 overflow-hidden my-5">
            <div className="card-body d-block w-100 overflow-hidden p-0">
              <div className="ps-0 d-flex">
                <h4 className="fw-700 font-xss text-grey-900 mb-0 p-4">
                  {tNFT("nft_tab_title")}
                </h4>
              </div>
              {isLoading && <DotWaveLoader />}
              {!isLoading && nftData?.length === 0 && (
                <div className="text-grey-600 mt-3 mb-5 text-center">
                  {tNFT("no_nft_found")}
                </div>
              )}
              {!isLoading && nftData?.length > 0 && (
                <div className="card-body d-block w-100 shadow-xss rounded-3 overflow-hidden p-4">
                  <div className={`${styles["nft-card_container"]}`}>
                    {nftData.map((nft, index) => (
                      <div
                        className={`${styles["nft-card"]} col-lg-4 col-md-4 col-6`}
                        key={nft.image_url}
                      >
                        <div
                          className="card p-0 border-0 h-100"
                          style={{ borderRadius: "10px" }}
                        >
                          <div
                            className={`${styles["nft-card_body"]} card-body p-3 position-relative`}
                          >
                            <div className="card-image col-12 p-0">
                              <Image
                                src={nft.image_url}
                                alt={nft.name ?? "NFT"}
                                width={200}
                                height={200}
                                className={styles["ntf-image"]}
                                loading="lazy"
                              />
                            </div>
                            <h5 className="fw-700 font-xss text-grey-900 mb-2 mt-3">
                              {nft.name ?? "NFT"}
                            </h5>
                            <p className="fw-500 font-xsss text-grey-500 m-0">
                              {nft.description.length > 50
                                ? `${nft.description.substring(0, 80)}...`
                                : nft.description}
                            </p>

                            {nftTokenIdSell.length > 0 &&
                            nftTokenIdSell.includes(+nft.token_id) ? (
                              <button
                                className="w-100 border-0 text-grey-600 position-absolute left-0 bottom-0"
                                onClick={() =>
                                  onCancelSellNFTHandler(+nft.token_id)
                                }
                              >
                                {tNFT("cancel_nft")}
                              </button>
                            ) : (
                              <button
                                className="w-100 border-0 text-grey-600 position-absolute left-0 bottom-0"
                                onClick={() => onSellNFTHandler(nft)}
                              >
                                {tNFT("sell_nft")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {openModal && (
          <SellNFTModal
            title={tNFT("sell_nft_title")}
            show={openModal}
            handleShow={() => setOpenModal(true)}
            handleClose={() => setOpenModal(false)}
            nft={nftToSell}
          />
        )}
      </div>
    </>
  );
};

export default TabNftProfile;
