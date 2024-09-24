import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/signalCard.module.scss";
import classNames from "classnames";
import Image from "next/image";
import { followABroker } from "@/api/onboard";
import Ratings from "../Ratings";
import { getSignalDetail } from "@/api/signal";
import type { getSignalCardResponse } from "@/api/signal/model";
import type { number } from "zod";
import convertDate from "@/utils/convert-date";
import CircleLoader from "../CircleLoader";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";
import CountdownTimer from "./CountdownTimer";

const SignalCard: React.FC<getSignalCardResponse> = ({
  id,
  entry,
  target,
  stop,
  description,
  owner,
  expiryAt,
  signalPair,
  readAt,
  type,
}) => {
  const { rateContract, connectWallet } = useWeb3();
  const tBase = useTranslations("Base");
  const [cardDetail, setCardDetail] = useState<getSignalCardResponse>();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isLuckyDraw, setIsLuckyDraw] = useState<boolean>(false);
  const [luckyCoin, setluckyCoin] = useState<number>(100000);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    owner?.followed || false,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signalType, setSignalType] = useState<string>("long");
  const [followerNum, setFollowerNum] = useState<number>(
    Number(owner?.followersCount) || 0,
  );
  const [avarageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    if (readAt) {
      setIsFlipped(true);
    }
    if (type) {
      setSignalType(type);
    }
  }, [readAt, type]);

  const fetchAverageRating = async (brokerId: number) => {
    try {
      console.log("broker", brokerId);
      const res = await rateContract.getAverageRating(brokerId.toString());
      const avgRating = res.brokerTotalScore.toNumber();
      console.log("aaa", res);
      console.log("average rating", avgRating);
      setAverageRating(Number(avgRating));
    } catch (err) {
      console.log(err);
    }
  };

  const onFlipCardHandler = async (id: string, brokerId: number) => {
    if (!isFlipped) {
      try {
        setIsLoading(true);
        setIsFlipped(true);
        const res = await getSignalDetail(id);
        fetchAverageRating(brokerId);
        console.log("backkkk", res);
        setCardDetail(res.data);
        setSignalType(res.data.type);
        setIsFollowing(res.data.owner.followed);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
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
        setFollowerNum((prevState) => prevState + 1);
      } else {
        e.target.classList.remove(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState - 1);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={classNames(styles.signal, styles["signal--card"])}
      onClick={() =>
        onFlipCardHandler(
          id,
          owner?.userId
            ? Number(owner?.userId)
            : (Number(cardDetail?.owner?.userId) as number),
        )
      }
    >
      <div
        className={`${isFlipped ? styles["is-flipped"] : ""} ${styles.card}`}
      >
        {/* FRONT */}
        <div
          className={classNames(
            styles["card__face"],
            styles["card__face--front"],
          )}
        >
          <span className={styles["view-card__cta"]}>Click to reveal</span>
          <span className={styles["currency_pair"]}>
            {signalPair.toUpperCase()}
          </span>
          <Image
            src="/assets/images/signal/signal-icon.png"
            width={154}
            height={192}
            alt="card icon"
            className={styles["card-icon"]}
          />
        </div>
        {/* BACK */}
        {isLoading && (
          <div
            className={`${styles["card__face"]} ${styles["card__face--loading"]}`}
          >
            <CircleLoader />
          </div>
        )}
        {!isLoading && (
          <div
            className={`
            ${
              isLuckyDraw
                ? styles["back__lucky-draw"]
                : signalType === "long"
                  ? styles["back-card__long"]
                  : styles["back-card__short"]
            } ${styles["card__face"]} ${styles["card__face--back"]}`}
          >
            {isLuckyDraw ? (
              <div>
                <Image
                  src="/assets/images/signal/lucky-icon.svg"
                  width={222}
                  height={150}
                  alt="lucky pocket"
                  className={styles["lucky-icon"]}
                />

                <div className={styles["lucky-draw__content"]}>
                  <h2 className="text-white">Lucky Draw</h2>
                  <h3 className="text-white">
                    {luckyCoin.toLocaleString()} ACN
                  </h3>
                  <CountdownTimer />
                </div>
                <button className={styles["claim-btn"]}>Claim Now</button>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="text-start m-0">
                      {signalPair.toUpperCase()}
                    </div>
                    <div
                      className={`${styles["signal-expiry"]} d-flex align-items-center`}
                    >
                      <i className="bi bi-clock-fill me-1"></i>
                      <span>
                        expiring on{" "}
                        {expiryAt
                          ? convertDate(expiryAt)
                          : cardDetail?.expiryAt
                            ? convertDate(cardDetail.expiryAt)
                            : ""}
                      </span>
                    </div>
                  </div>
                  <div
                    className={
                      signalType === "long" ? "text-success" : "text-danger"
                    }
                  >
                    {signalType === "long" ? "Long" : "Short"}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 mt-3 fw-400 text-start">
                  <div className={styles["signal-price"]}>
                    <div
                      className={`${signalType === "long" ? styles["target-long"] : styles["target-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        Target
                      </span>
                      <span className="fw-bold">
                        {target ? target : cardDetail?.target}
                      </span>
                    </div>
                    <div
                      className={`${signalType === "long" ? styles["entry-long"] : styles["entry-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        Entry
                      </span>
                      <span className="fw-bold">
                        {entry ? entry : cardDetail?.entry}
                      </span>
                    </div>
                    <div
                      className={`${signalType === "long" ? styles["stop-long"] : styles["stop-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        Stop
                      </span>
                      <span className="fw-bold">
                        {stop ? stop : cardDetail?.stop}
                      </span>
                    </div>
                    <div className={styles["signal-graph__vertical_line"]} />
                  </div>
                  <Image
                    src={`/assets/images/signal/${signalType === "long" ? "signal-long.png" : "signal-short.png"}`}
                    width={122}
                    height={104}
                    alt="signal type"
                  />
                </div>

                <div className="w-100 mt-3 fw-400 text-start">
                  {description
                    ? description
                    : cardDetail?.description && cardDetail.description}
                </div>

                <div className={styles["signal-author"]}>
                  <div className={`${styles["signal-author__details"]} d-flex`}>
                    <Image
                      src={
                        owner?.photo?.path
                          ? owner?.photo?.path
                          : "/assets/images/user.png"
                      }
                      width={50}
                      height={50}
                      alt="broker avatar"
                      className={styles["signal-broker__avatar"]}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <h2 className="text-white font-xss fw-800 m-0">
                        {owner?.nickName
                          ? owner?.nickName
                          : cardDetail?.owner?.nickName}
                      </h2>
                      <div className="font-xssss fw-300">
                        {" "}
                        {followerNum >= 1000
                          ? (followerNum / 1000).toFixed(1)
                          : followerNum}{" "}
                        {followerNum >= 1000 ? "k" : ""}{" "}
                        {followerNum > 1
                          ? tBase("followers")
                          : tBase("follower")}
                      </div>
                    </div>
                    <div className="mt-0 ms-2 text-center">
                      <Ratings rating={avarageRating} size={12} />
                      <span className="font-xssss fw-300">Rating: </span>
                      <span className="font-xsss">{avarageRating}</span>
                    </div>
                  </div>
                  <button
                    className={`${isFollowing ? styles["follow-broker"] : styles["follow-btn"]} main-btn mt-2 mb-0 border-0 px-3 py-1 z-index-1 rounded-4 text-white font-xssss cursor-pointer fw-700 ls-1`}
                    onClick={(e) =>
                      onFollowBrokerHandler(
                        e,
                        owner?.userId
                          ? Number(owner?.userId)
                          : (Number(cardDetail?.owner?.userId) as number),
                      )
                    }
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalCard;
