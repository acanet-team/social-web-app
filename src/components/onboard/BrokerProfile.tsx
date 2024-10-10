import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/brokerProfile.module.scss";
import { followABroker } from "@/api/onboard";
import { useWeb3 } from "@/context/wallet.context";
import Tooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function BrokerProfile(props: {
  brokerId: number;
  firstName: string;
  lastName: string;
  followed: boolean;
  followersCount: number;
  coursesEnrolledCount: number;
  email: string;
  signalAccuracy: string;
  summary: string;
  rank: string;
  photo: any;
  nickName: string;
}) {
  const {
    brokerId,
    firstName,
    lastName,
    followed,
    followersCount = 0,
    rank,
    email,
    signalAccuracy,
    summary,
    photo,
    nickName,
  } = props;
  const tBroker = useTranslations("BrokerList");
  const tBase = useTranslations("Base");
  const { rateContract } = useWeb3();
  const [isFollowing, setIsFollowing] = useState<boolean>(followed);
  const [avarageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    fetchAverageRating(brokerId);
  }, [brokerId]);

  const fetchAverageRating = async (brokerId: number) => {
    try {
      const res = await rateContract.getAverageRating(brokerId.toString());
      const avgRating =
        res.brokerTotalScore.toNumber() / res.brokerRatingCount.toNumber() || 0;
      console.log("rrrr", avgRating);
      setAverageRating(Number(avgRating));
    } catch (err) {
      console.log(err);
    }
  };

  const onFollowBrokerHandler = (e: any, brokerId: number) => {
    try {
      setIsFollowing((following) => !following);
      // Calling api
      followABroker({
        userId: brokerId,
        followType: isFollowing ? "UNFOLLOW" : "FOLLOW",
      });
      if (!isFollowing) {
        e.target.classList.add(styles["follow-broker"]);
      } else {
        e.target.classList.remove(styles["follow-broker"]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="col-xl-2 col-lg-4 col-sm-6 w-100 h-100">
      <div
        className={`card d-block border-0 shadow-xss rounded-3 overflow-hidden h-100`}
      >
        <div className={`${styles["broker-profile"]} card-body w-100 h-100`}>
          <figure
            className="avatar ms-auto me-auto mb-0 position-relative z-index-1"
            style={{ height: "100px" }}
          >
            <Image
              src={
                photo?.id
                  ? photo?.path
                  : "https://via.placeholder.com/300x300.png"
              }
              width={100}
              height={100}
              alt="avatar"
              className={`${styles["broker-profile-img"]} shadow-xss rounded-circle`}
            />
          </figure>
          <div className="ms-1">
            <Link href={`/profile/${nickName}`}>
              <h4 className="fw-700 fs-2 mt-3 mb-0 text-center">
                {firstName + " " + lastName}
              </h4>
            </Link>
            <div className={`${styles["broker-email"]} text-align`}>
              {email}
            </div>
          </div>
          {/* Broker's data */}
          <div className="d-flex mt-3 gap-3 w-100 justify-content-center">
            <div className={`${styles["broker-stats"]} d-flex flex-column`}>
              <div className="fw-bold fs-2">
                {followersCount >= 1000
                  ? (followersCount / 1000).toFixed(1)
                  : followersCount}{" "}
                {followersCount >= 1000 ? "k" : ""}
              </div>
              <div className={`${styles["broker-stats__text"]} h-100`}>
                {followersCount > 1 ? tBase("followers") : tBase("follower")}
              </div>
            </div>
            <div className={`${styles["broker-stats"]} d-flex flex-column`}>
              <div className="fw-bold fs-2">
                {!Number.isNaN(signalAccuracy) && signalAccuracy !== undefined
                  ? signalAccuracy + "%"
                  : "N/A"}
              </div>
              <div
                className={`${styles["broker-stats__text"]} h-100 position-relative`}
              >
                {tBroker("signal_accuracy")}
                <Tooltip title={tBroker("signal_accuracy_tooltip")}>
                  <i
                    className="bi bi-info-circle position-absolute"
                    style={{ top: "-1px", right: "-10px", fontSize: "12px" }}
                  ></i>
                </Tooltip>
              </div>
            </div>
            <div className={`${styles["broker-stats"]} d-flex flex-column`}>
              <div className="fw-bold fs-2">{avarageRating}</div>
              <div className={`${styles["broker-stats__text"]} h-100`}>
                {tBase("ratings")}
              </div>
            </div>
          </div>
          <div
            className={`${styles["broker-summary"]} dark-theme-text mt-3 h-100 overflow-hidden`}
          >
            {summary === null && (
              <div className="mt-5">{tBroker("no_AI_summary")}</div>
            )}
            {summary?.length > 370
              ? summary.substring(0, 370) + "..."
              : summary}
          </div>

          <button
            type="button"
            className={`${styles["follow-btn"]} ${isFollowing ? styles["follow-broker"] : ""} main-btn bg-current text-center text-white fw-500 w125 border-0 d-inline-block rounded-xxl`}
            onClick={(e) => onFollowBrokerHandler(e, brokerId)}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </button>
        </div>
      </div>
    </div>
  );
}
