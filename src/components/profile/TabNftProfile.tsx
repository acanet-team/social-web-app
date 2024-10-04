import type { User } from "@/api/profile/model";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DotWaveLoader from "../DotWaveLoader";
import { useSession } from "next-auth/react";
import { useWeb3 } from "@/context/wallet.context";
import httpClient from "@/api";
import axios from "axios";
import { Agent } from "http";
import styles from "@/styles/modules/TabNftProfile.module.scss";

const TabNftProfile = (props: { user: User; idParam: string }) => {
  const { user, idParam } = props;
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(false);
  const [isLoading, setLoading] = useState<Boolean>(false);
  const [nftData, setNftData] = useState<any[]>([]);
  const { nftContract, connectWallet, account } = useWeb3();
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
      console.log(nftDataArray);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user.walletAddress) {
      getAllNFTs(user.walletAddress);
    }
  }, [user, user.walletAddress]);

  return (
    <>
      <div className="row">
        <div className="col-xl-12 col-12">
          <div className="card p-0 border-0 shadow-xss rounded-3 overflow-hidden my-5">
            <div className="card-body d-block w-100 overflow-hidden p-0">
              <div className="ps-0 d-flex">
                <h4 className="fw-700 font-xss text-grey-900 mb-0 p-4">
                  NFT Profile
                </h4>
              </div>
              {isLoading && <DotWaveLoader />}
              {!isLoading && nftData?.length === 0 && (
                <div className="text-grey-600 mt-3 mb-5 text-center">
                  No NFTs found
                </div>
              )}
              {!isLoading && nftData?.length > 0 && (
                <div className="card-body d-block w-100 shadow-xss rounded-3 overflow-hidden p-4">
                  <div className={`${styles["nft-card_container"]}`}>
                    {nftData.map((nft, index) => (
                      <div
                        className={`${styles["nft-card"]} col-lg-4 col-md-4 col-6`}
                        key={nftData[0].image_url}
                      >
                        <div className="card p-0 border-0 h-100">
                          <div className="card-body p-3">
                            <div className="card-image col-12 p-0">
                              <Image
                                src={nftData[0].image_url}
                                alt={nftData[0].name ?? "NFT"}
                                width={200}
                                height={200}
                                className={styles["ntf-image"]}
                                loading="lazy"
                              />
                            </div>
                            <h5 className="fw-700 font-xss text-grey-900 mb-2 mt-3">
                              {nftData[0].name ?? "NFT"}
                            </h5>
                            <p className="fw-500 font-xsss text-grey-500 m-0">
                              {nftData[0].description.length > 50
                                ? `${nftData[0].description.substring(0, 80)}...`
                                : nftData[0].description}
                            </p>
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
      </div>
    </>
  );
};

export default TabNftProfile;
