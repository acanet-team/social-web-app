import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/signalCard.module.scss";
import classNames from "classnames";
import Image from "next/image";
import { followABroker } from "@/api/onboard";
import Ratings from "../Ratings";
import { claimLuckyToken, getSignalDetail } from "@/api/signal";
import type { getSignalCardResponse } from "@/api/signal/model";
import convertDate from "@/utils/convert-date";
import CircleLoader from "../CircleLoader";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";
import CountdownTimer from "./CountdownTimer";
import LuckyDrawEffect from "./LuckyDrawEffect";
import Link from "next/link";
import { throwToast } from "@/utils/throw-toast";
import { setConstantValue } from "typescript";
import { id } from "ethers/lib/utils";
import AlertModal from "../AlertModal";

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
  brokerId,
  curUserId,
  luckyAmount,
  readsCount,
}) => {
  const tBase = useTranslations("Base");
  const tSignal = useTranslations("Signal");
  const { rateContract, connectWallet } = useWeb3();
  const [cardDetail, setCardDetail] = useState<getSignalCardResponse>();
  const [isFlipped, setIsFlipped] = useState<boolean>(readAt ? true : false);
  const [isLuckyDraw, setIsLuckyDraw] = useState<boolean>(
    type ? type === "luckydraw" : false,
  );
  const [luckyDrawId, setLuckyDrawId] = useState<string>(id);
  const [luckyCoin, setluckyCoin] = useState<number | undefined>(
    luckyAmount ? luckyAmount : 0,
  );
  const [countdownDuration, setCountdownDuration] = useState<number | null>(
    expiryAt ? expiryAt : 0,
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(
    owner?.followed || false,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);
  const [finishClaim, setFinishClaim] = useState<boolean>(false);
  const [flipDepleted, setFlipDepleted] = useState<{
    isDepleted: boolean;
    msg: string;
  }>({ isDepleted: false, msg: "" });
  const [signalType, setSignalType] = useState<string>("long");
  const [followerNum, setFollowerNum] = useState<number>(
    Number(owner?.followersCount) || 0,
  );
  const [avarageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    if (readAt || (brokerId && curUserId === brokerId)) {
      setIsFlipped(true);
    }
    if (type) {
      setSignalType(type);
    }
  }, [readAt, type, curUserId]);

  useEffect(() => {
    fetchAverageRating(
      owner?.userId
        ? Number(owner?.userId)
        : (Number(cardDetail?.owner?.userId) as number),
    );
  }, [isFlipped]);

  const fetchAverageRating = async (brokerId: number) => {
    try {
      const res = await rateContract.getAverageRating(brokerId.toString());
      const avgRating =
        res.brokerTotalScore.toNumber() / res.brokerRatingCount.toNumber() || 0;
      setAverageRating(Number(avgRating));
    } catch (err) {
      console.log(err);
    }
  };

  const onFlipCardHandler = async (id: string) => {
    if (!isFlipped) {
      try {
        setIsLoading(true);
        const res = await getSignalDetail(id);
        console.log("typeee", res);
        setIsFlipped(true);
        if (res.data.type === "luckydraw") {
          setCountdownDuration(res.data.expiryAt);
          setluckyCoin(res.data.luckyAmount);
          setLuckyDrawId(res.data.id || id);
          if (res.data.expiryAt - Date.now() < 0) {
            setIsFlipped(false);
            setIsLuckyDraw(false);
            console.log("expiry date must be in the future");
            return throwToast("Something went wrong", "error");
          }
          setIsLuckyDraw(true);
        } else {
          setIsClaimLoading(false);
          console.log("backkkk", res);
          setCardDetail(res.data);
          setSignalType(res.data.type);
          setIsFollowing(res.data.owner.followed);
        }
      } catch (err) {
        setIsFlipped(false);
        console.log(err);
        if (err.code === "ER15010") {
          // return throwToast(err.message, "warning");
          setFlipDepleted({ isDepleted: true, msg: err.message });
        }
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

  const onClaimLuckyTokenHandler = async (id: string) => {
    connectWallet();
    try {
      setIsClaimLoading(true);
      console.log("id", id);
      await claimLuckyToken(id);
      setFinishClaim(true);
    } catch (err) {
      console.log(err);
      throwToast("Can't claim the lucky token", "error");
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleCloseAlert = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();
    setFlipDepleted({ isDepleted: false, msg: "" });
  };
  return (
    <div
      className={classNames(styles.signal, styles["signal--card"])}
      onClick={() => onFlipCardHandler(id)}
    >
      {flipDepleted.isDepleted && (
        <AlertModal
          show={flipDepleted.isDepleted}
          message={flipDepleted.msg}
          title=""
          type="alert"
          handleClose={handleCloseAlert}
          onProceed={handleCloseAlert}
        />
      )}
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
          <span className={styles["view-card__cta"]}>
            {tSignal("reveal_card")}
          </span>
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
                <LuckyDrawEffect />
                <Image
                  src="/assets/images/signal/lucky-icon.svg"
                  width={222}
                  height={150}
                  alt="lucky pocket"
                  className={styles["lucky-icon"]}
                />

                <div className={styles["lucky-draw__content"]}>
                  <h2 className="text-white">{tSignal("luck_draw")}</h2>
                  <h3 className="text-white">
                    {luckyCoin?.toLocaleString()} ACN
                  </h3>
                  {countdownDuration && (
                    <CountdownTimer
                      time={countdownDuration}
                      onFinish={() => setIsFlipped(false)}
                    />
                  )}
                </div>
                <button
                  disabled={isClaimLoading || finishClaim ? true : false}
                  className={
                    isClaimLoading || finishClaim
                      ? styles["claim-btn__disable"]
                      : styles["claim-btn"]
                  }
                  onClick={() => onClaimLuckyTokenHandler(luckyDrawId)}
                >
                  {isClaimLoading ? (
                    <span
                      className="spinner-border spinner-border-md"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : finishClaim ? (
                    tSignal("claimed")
                  ) : (
                    tSignal("claim_now")
                  )}
                </button>
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

                <div className="d-flex justify-content-between align-items-center w-100 mt-3 fw-400 text-start position-relative">
                  <div className={styles["signal-price"]}>
                    <div
                      className={`${signalType === "long" ? styles["target-long"] : styles["target-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        Target
                      </span>
                      <span className="fw-bold">
                        {target
                          ? parseFloat(
                              target.toString().replace(/^0+/, ""),
                            ).toLocaleString()
                          : cardDetail?.target
                            ? parseFloat(
                                cardDetail.target.toString().replace(/^0+/, ""),
                              ).toLocaleString()
                            : ""}
                      </span>
                    </div>
                    <div
                      className={`${signalType === "long" ? styles["entry-long"] : styles["entry-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        Entry
                      </span>
                      <span className="fw-bold">
                        {entry
                          ? parseFloat(
                              entry.toString().replace(/^0+/, ""),
                            ).toLocaleString()
                          : cardDetail?.entry
                            ? parseFloat(
                                cardDetail?.entry
                                  ?.toString()
                                  .replace(/^0+/, ""),
                              ).toLocaleString()
                            : ""}
                      </span>
                    </div>
                    <div
                      className={`${signalType === "long" ? styles["stop-long"] : styles["stop-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        Stop
                      </span>
                      <span className="fw-bold">
                        {stop
                          ? parseFloat(
                              stop.toString().replace(/^0+/, ""),
                            ).toLocaleString()
                          : cardDetail?.stop
                            ? parseFloat(
                                cardDetail?.stop.toString().replace(/^0+/, ""),
                              ).toLocaleString()
                            : ""}
                      </span>
                    </div>
                    <div className={styles["signal-graph__vertical_line"]} />
                  </div>
                  <Image
                    src={`/assets/images/signal/${signalType === "long" ? "signal-long.png" : "signal-short.png"}`}
                    width={122}
                    height={104}
                    alt="signal type"
                    className={styles["signal-graph"]}
                  />
                </div>

                <div className="w-100 mt-3 fw-400 text-start">
                  {description
                    ? description
                    : cardDetail?.description && cardDetail.description}
                </div>

                <div className={styles["signal-author"]}>
                  <div className={`${styles["signal-author__details"]} d-flex`}>
                    <Link
                      href={`/profile/${
                        owner?.nickName
                          ? owner?.nickName
                          : cardDetail?.owner?.nickName
                      }`}
                    >
                      <Image
                        src={
                          owner?.photo?.path
                            ? owner?.photo?.path
                            : cardDetail?.owner?.photo?.path ||
                              "/assets/images/user.png"
                        }
                        width={50}
                        height={50}
                        alt="broker avatar"
                        className={styles["signal-broker__avatar"]}
                      />
                    </Link>
                    <div className="d-flex flex-column justify-content-center">
                      <Link
                        href={`/profile/${
                          owner?.nickName
                            ? owner?.nickName
                            : cardDetail?.owner?.nickName
                        }`}
                      >
                        <h2 className="text-white font-xss fw-800 m-0">
                          {owner?.nickName
                            ? owner?.nickName
                            : cardDetail?.owner?.nickName}
                        </h2>
                      </Link>
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
                    {readsCount && brokerId ? (
                      <div className="mt-0 ms-2 text-center d-flex flex-wrap">
                        <Image
                          src="/assets/images/signal/signal_view.png"
                          width={20}
                          height={20}
                          alt="views"
                        />
                        <span className="ms-1 font-xssss fw-300">{`${readsCount >= 1000 ? Math.round(readsCount / 1000).toFixed(1) : readsCount} ${readsCount >= 1000 ? "k" : ""} ${readsCount > 1 ? tBase("views") : tBase("view")}`}</span>
                      </div>
                    ) : (
                      <div className="mt-0 ms-2 text-center">
                        <Ratings rating={avarageRating} size={12} />
                        <span className="font-xssss fw-300">Rating: </span>
                        <span className="font-xsss">
                          {avarageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  {((brokerId !== owner?.userId &&
                    brokerId !== cardDetail?.owner?.userId) ||
                    curUserId !== brokerId) && (
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
                  )}
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
