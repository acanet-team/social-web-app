import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/header.module.scss";
import Image from "next/image";
import type {
  FullSearchItem,
  ISearchCommunityResponse,
  ISearchUserResponse,
} from "@/api/search/model";
import { useTranslations } from "next-intl";
import { followABroker } from "@/api/onboard";
import { postConnectRequest, postConnectResponse } from "@/api/connect";
import { throwToast } from "@/utils/throw-toast";
import { useWeb3 } from "@/context/wallet.context";
import { joinCommunity } from "@/api/community";
import { joinPaidCommunity } from "@/api/wallet";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";

export default function QuickSearchCard(props: {
  type: "community" | "user";
  isFullSearch: boolean;
  data: FullSearchItem;
}) {
  const { type, isFullSearch, data } = props;
  const tBase = useTranslations("Base");
  const t = useTranslations("MyProfile");
  const tInvestor = useTranslations("Connect_investor");
  const tCommunity = useTranslations("Community");
  const { connectWallet, communityContract, account, connectedChain } =
    useWeb3();
  const [curUser, setCurUser] = useState<number>();
  const { data: session } = useSession();
  const [followerNum, setFollowerNum] = useState<number>(
    Number((data as ISearchUserResponse).followersCount) || 0,
  );
  const [memberNum, setMemeberNum] = useState<number>(
    Number((data as ISearchCommunityResponse).membersCount || 0),
  );
  const [isFollowing, setIsFollowing] = useState<string>(
    (data as ISearchUserResponse).followStatus || "",
  );
  const [isConnecting, setIsConnecting] = useState<string>(
    (data as ISearchUserResponse).connectionStatus || "",
  );
  const [isJoinedCommunity, setIsJoinedCommunity] = useState<string>(
    (data as ISearchCommunityResponse).communityStatus,
  );
  const [openConnectionResponse, setOpenConnectionResponse] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const buttonRespondRef = useRef<HTMLButtonElement>(null);
  const groupRespondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) {
      setCurUser(session.user?.id);
    }
  }, [session]);

  const onFollowBroker = (e: any, brokerId: number) => {
    try {
      setIsLoading(true);
      setIsFollowing((following) =>
        following === "followed" ? "not_follow" : "followed",
      );
      followABroker({
        userId: brokerId,
        followType: isFollowing === "followed" ? "UNFOLLOW" : "FOLLOW",
      });
      if (isFollowing === "not_follow") {
        e.target.classList.add(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState + 1);
      } else {
        e.target.classList.remove(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState - 1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onConnectInvestor = (e: any, userId: number) => {
    try {
      setIsLoading(true);
      if (isConnecting !== "request_received") {
        postConnectRequest(
          userId,
          isConnecting === "connected" || isConnecting === "request_send"
            ? "cancel_request"
            : "request",
        );
        setIsConnecting((connecting) =>
          connecting === "not_connected"
            ? "request_send"
            : connecting === "connected"
              ? "not_connected"
              : connecting === "request_received"
                ? "request_received"
                : "request_send",
        );
      } else {
        setOpenConnectionResponse((open) => !open);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectResponse = async (
    connectionRequestId: string,
    action: string,
  ) => {
    setIsLoading(true);
    try {
      await postConnectResponse(connectionRequestId, action);
      if (action === "reject") {
        setIsConnecting("not_connected");
      } else if (action === "accept") {
        setIsConnecting("connected");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadingSpinner = (
    <span
      className="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
  );

  const onJoinCommunityHandler = async (fee: number, groupId: string) => {
    try {
      setIsLoading(true);
      if (fee > 0) {
        connectWallet();
        // Calling smart contract
        const res = await communityContract.joinGroup(
          groupId,
          curUser?.toString(),
          {
            from: account?.address,
            gasLimit: 2000000,
            value: ethers.utils.parseEther(fee.toString()),
          },
        );
        const hasTransaction = res.hash;
        // Calling api
        joinPaidCommunity({
          communityId: groupId,
          hashTransaction: hasTransaction,
          network: connectedChain?.id === "0x780c" ? "30732" : "72",
        });
      } else {
        joinCommunity({ communityId: groupId });
      }
      setIsJoinedCommunity("pending_request");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !buttonRespondRef?.current?.contains(event.target as Node) &&
      !groupRespondRef?.current?.contains(event.target as Node)
    ) {
      setOpenConnectionResponse(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${styles["quick-search__card"]} d-flex justify-content-between align-items-center`}
    >
      <div className="d-flex gap-3 align-items-center">
        <Image
          src={
            type === "user"
              ? (data as ISearchUserResponse)?.photo?.path ||
                "/assets/images/user.png"
              : (data as ISearchCommunityResponse)?.avatar?.path ||
                "/assets/images/user.png"
          }
          width={50}
          height={50}
          alt="search avatar"
          className={type === "user" ? "rounded-circle" : "rounded-3"}
          style={{ objectFit: "cover" }}
        />

        <div className="d-flex flex-column gap-0">
          <div className={`fw-bold font-xss ${styles["text-dark-mode"]}`}>
            {type === "user"
              ? `${(data as ISearchUserResponse).firstName} ${(data as ISearchUserResponse).lastName}`
              : (data as ISearchCommunityResponse).name}
          </div>
          {type === "user" ? (
            <div className={`${styles["quick-search_numbers"]}`}>
              {followerNum >= 1000
                ? Math.round(followerNum / 1000).toFixed(1)
                : followerNum}
              <span>{followerNum >= 1000 ? "k" : ""}</span>{" "}
              {followerNum >= 1000 ? tBase("followers") : tBase("follower")}
            </div>
          ) : (
            <div className={styles["quick-search_numbers"]}>
              <span className="me-1">
                {(data as ISearchCommunityResponse).fee === 0
                  ? tCommunity("free")
                  : tCommunity("paid")}
              </span>
              |
              <span className="ms-1">
                {memberNum >= 1000
                  ? Math.round(memberNum / 1000).toFixed(1)
                  : memberNum}{" "}
                {memberNum >= 1000 ? tBase("members") : tBase("member")}
              </span>
              {type === "community" && isFullSearch && (
                <div>
                  {(data as ISearchCommunityResponse).description.substring(
                    0,
                    90,
                  ) + "..."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="d-flex flex-column">
        {type === "user" && (data as ISearchUserResponse).role === "broker" && (
          <button
            className={`${isFollowing === "followed" ? styles["follow-broker"] : styles["follow-btn"]} main-btn border-0 font-xsss h30 w90 mb-1 cursor-pointer px-2 py-0 m-0`}
            onClick={(e) =>
              onFollowBroker(e, (data as ISearchUserResponse).userId)
            }
          >
            {isFollowing === "followed" ? "Followed" : "Follow"}
          </button>
        )}
        {type === "user" &&
          (data as ISearchUserResponse).role === "investor" && (
            <button
              className={`${isConnecting !== "not_connected" ? styles["follow-broker"] : styles["follow-btn"]} main-btn border-0 font-xsss h30 w90 mb-1 cursor-pointer px-2 py-0 m-0 position-relative`}
              onClick={(e) =>
                onConnectInvestor(e, (data as ISearchUserResponse).userId)
              }
              ref={buttonRespondRef}
            >
              {isLoading
                ? loadingSpinner
                : isConnecting === "connected"
                  ? tInvestor("connected")
                  : isConnecting === "request_send"
                    ? tInvestor("request_send")
                    : isConnecting === "request_received"
                      ? tInvestor("response")
                      : tInvestor("connect")}
              {openConnectionResponse &&
                isConnecting === "request_received" && (
                  <div
                    ref={groupRespondRef}
                    className={`card ${styles["group-buttons-banner-response"]}`}
                    style={{
                      display: openConnectionResponse ? "block" : "none",
                    }}
                  >
                    <button
                      className={`px-3 ${styles["button-banner-response"]}`}
                      onClick={() =>
                        connectResponse(
                          (data as ISearchUserResponse).connectionRequestId,
                          "accept",
                        )
                      }
                    >
                      <p className={`font-xss fw-600 m-0`}>{t("confirm")}</p>
                    </button>
                    <button
                      className={`px-3 ${styles["button-banner-response"]}`}
                      onClick={() =>
                        connectResponse(
                          (data as ISearchUserResponse).connectionRequestId,
                          "reject",
                        )
                      }
                    >
                      <p className="font-xss fw-600 m-0">{t("delete")}</p>
                    </button>
                  </div>
                )}
            </button>
          )}
        {type === "community" && (
          <button
            className={`${isJoinedCommunity === "joined" || isJoinedCommunity === "pending_request" || isLoading ? styles["follow-broker"] : styles["follow-btn"]} main-btn border-0 font-xsss h30 w90 mb-1 cursor-pointer px-2 py-0 m-0`}
            onClick={() =>
              onJoinCommunityHandler(
                (data as ISearchCommunityResponse).fee,
                (data as ISearchCommunityResponse).id,
              )
            }
            disabled={isLoading ? true : false}
          >
            {isLoading
              ? loadingSpinner
              : isJoinedCommunity === "joined"
                ? tCommunity("joined")
                : isJoinedCommunity === "pending_request"
                  ? tCommunity("pending")
                  : tCommunity("join")}
          </button>
        )}
        {type === "community" && (data as ISearchCommunityResponse).fee > 0 && (
          <div className="d-flex align-items-center justify-content-center">
            <Image
              width={18}
              height={18}
              src={"/assets/images/logo/logo-only-transparent.png"}
              alt="logo"
              style={{ objectFit: "cover" }}
            />
            <span className="ms-2 fw-bolder text-dark font-xsss">
              {(data as ISearchCommunityResponse).fee}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
