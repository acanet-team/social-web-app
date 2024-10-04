import type { User } from "@/api/profile/model";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DotWaveLoader from "../DotWaveLoader";
import { useSession } from "next-auth/react";
import { useWeb3 } from "@/context/wallet.context";
import httpClient from "@/api";
import axios from "axios";
import { Agent } from "http";

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
      {isLoading && <DotWaveLoader />}
      {!isLoading && (
        <div className="row">
          <div className="col-xl-12 col-12">
            <div className="card p-4 border-0 shadow-xss rounded-3 overflow-hidden mb-3">
              <div className="card-body d-block w-100 shadow-xss rounded-3 overflow-hidden p-0">
                <div className="p-4 d-flex rounded-3 bg-greylight">
                  <h4 className="fw-700 font-xssss text-grey-900 mb-0">
                    NFT Profile
                  </h4>
                </div>
                <div className="card-body d-block w-100 shadow-xss rounded-3 overflow-hidden p-4 bg-greylight">
                  {nftData.length > 0 ? (
                    <div className="row">
                      {nftData.map((nft, index) => (
                        <div className="col-lg-4 col-md-4 col-6" key={index}>
                          <div className="card p-0 border-0 mb-3">
                            <div className="card-body p-3">
                              <div className="card-image col-12 p-0 mb-3">
                                <Image
                                  src={nft.image_url}
                                  alt={nft.name ?? "NFT"}
                                  width={200}
                                  height={200}
                                />
                              </div>
                              <h5 className="fw-700 font-xssss text-grey-900 mb-2">
                                {nft.name ?? "NFT"}
                              </h5>
                              <p className="fw-500 font-xsssss text-grey-500">
                                {nft.description.length > 50
                                  ? `${nft.description.substring(0, 50)}...`
                                  : nft.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-grey-600 mt-3 text-center">
                      No NFTs found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabNftProfile;
