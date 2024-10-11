import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/signalCard.module.scss";
import classNames from "classnames";
import Image from "next/image";
import { followABroker } from "@/api/onboard";
import Ratings from "../Ratings";
import { claimLuckyToken, getSignalDetail, trackSignal } from "@/api/signal";
import type { getSignalCardResponse } from "@/api/signal/model";
import convertDate from "@/utils/convert-date";
import CircleLoader from "../CircleLoader";
import { useTranslations } from "next-intl";
import { useWeb3 } from "@/context/wallet.context";
import CountdownTimer from "./CountdownTimer";
import LuckyDrawEffect from "./LuckyDrawEffect";
import Link from "next/link";
import { throwToast } from "@/utils/throw-toast";
import AlertModal from "../AlertModal";
import { Button, Grid, IconButton, Tooltip } from "@mui/material";
import signal from "@/pages/signal";

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
  isTracking,
  readsCount,
  signalAccuracy,
}) => {
  const tBase = useTranslations("Base");
  const tSignal = useTranslations("Signal");
  const tBroker = useTranslations("BrokerList");
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
  const [authorName, setAuthorName] = useState<string>(
    owner?.nickName || cardDetail?.owner?.nickName || "",
  );

  const [avarageRating, setAverageRating] = useState<number>(0);
  const [isTrackingSignal, sedtIsTrackingSignal] = useState<boolean>(
    isTracking || false,
  );

  useEffect(() => {
    setAuthorName(owner?.nickName || cardDetail?.owner?.nickName || "");
  }, [owner?.nickName, cardDetail?.owner?.nickName]);

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
        if (err.code === "ER15013") {
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

  const onTrackSignalHandler = async (
    cardId: string,
    type: "track" | "untrack",
  ) => {
    try {
      if (cardId) {
        await trackSignal(cardId, type);
        sedtIsTrackingSignal((prev) => !prev);
        throwToast(
          type === "track"
            ? tSignal("track_sucess")
            : tSignal("untrack_sucess"),
          "success",
        );
      }
    } catch (err) {
      console.log(err);
    }
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
          <div className={styles["card-accuracy"]}>
            {tSignal("accuracy") + ": "}
            {!Number.isNaN(signalAccuracy) && signalAccuracy
              ? +signalAccuracy % 1 !== 0
                ? (+signalAccuracy).toFixed(2) + "%"
                : +signalAccuracy + "%"
              : !Number.isNaN(cardDetail?.signalAccuracy) &&
                  cardDetail?.signalAccuracy
                ? +cardDetail.signalAccuracy % 1 !== 0
                  ? (+cardDetail.signalAccuracy).toFixed(2) + "%"
                  : +cardDetail.signalAccuracy + "%"
                : "N/A"}
          </div>
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
              <div className="position-relative">
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
                        {tSignal("expiring")}{" "}
                        {expiryAt
                          ? convertDate(expiryAt)
                          : cardDetail?.expiryAt
                            ? convertDate(cardDetail.expiryAt)
                            : ""}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`${signalType === "long" ? "text-success" : "text-danger"} position-relative`}
                  >
                    {signalType === "long" ? "Long" : "Short"}
                    {curUserId !== cardDetail?.owner.userId &&
                      curUserId !== brokerId && (
                        <div
                          className={`${isTrackingSignal ? styles["signal-tracking"] : styles["signal-track"]} ${styles["track-btn"]}`}
                          onClick={() =>
                            onTrackSignalHandler(
                              id ? id : (cardDetail?.id as string),
                              isTrackingSignal ? "untrack" : "track",
                            )
                          }
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/assets/images/signal/bell-ring.png"
                            alt="signal bell"
                          />
                        </div>
                      )}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 mt-3 fw-400 text-start position-relative">
                  <div className={styles["signal-price"]}>
                    <div
                      className={`${signalType === "long" ? styles["target-long"] : styles["target-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        {tSignal("target")}
                      </span>
                      <span className="fw-bold">
                        {target
                          ? parseFloat(
                              target.toString().replace(/^0+/, ""),
                            ).toLocaleString(undefined, {
                              minimumFractionDigits:
                                target?.toString().split(".")[1]?.length || 0,
                              maximumFractionDigits:
                                target?.toString().split(".")[1]?.length || 10,
                            })
                          : cardDetail?.target
                            ? parseFloat(
                                cardDetail.target.toString().replace(/^0+/, ""),
                              ).toLocaleString(undefined, {
                                minimumFractionDigits:
                                  cardDetail.target.toString().split(".")[1]
                                    ?.length || 0,
                                maximumFractionDigits:
                                  cardDetail.target.toString().split(".")[1]
                                    ?.length || 10,
                              })
                            : ""}
                      </span>
                    </div>
                    <div
                      className={`${signalType === "long" ? styles["entry-long"] : styles["entry-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        {tSignal("entry")}
                      </span>
                      <span className="fw-bold">
                        {entry
                          ? parseFloat(
                              entry.toString().replace(/^0+/, ""),
                            ).toLocaleString(undefined, {
                              minimumFractionDigits:
                                entry.toString().split(".")[1]?.length || 0,
                              maximumFractionDigits:
                                entry.toString().split(".")[1]?.length || 10,
                            })
                          : cardDetail?.entry
                            ? parseFloat(
                                cardDetail?.entry
                                  ?.toString()
                                  .replace(/^0+/, ""),
                              ).toLocaleString(undefined, {
                                minimumFractionDigits:
                                  cardDetail?.entry?.toString().split(".")[1]
                                    ?.length || 0,
                                maximumFractionDigits:
                                  cardDetail?.entry?.toString().split(".")[1]
                                    ?.length || 10,
                              })
                            : ""}
                      </span>
                    </div>
                    <div
                      className={`${signalType === "long" ? styles["stop-long"] : styles["stop-short"]} d-flex gap-4`}
                    >
                      <span className={styles["signal-price__title"]}>
                        {tSignal("stop")}
                      </span>
                      <span className="fw-bold">
                        {stop
                          ? parseFloat(
                              stop.toString().replace(/^0+/, ""),
                            ).toLocaleString(undefined, {
                              minimumFractionDigits:
                                stop.toString().split(".")[1]?.length || 0,
                              maximumFractionDigits:
                                stop.toString().split(".")[1]?.length || 10,
                            })
                          : cardDetail?.stop
                            ? parseFloat(
                                cardDetail?.stop.toString().replace(/^0+/, ""),
                              ).toLocaleString(undefined, {
                                minimumFractionDigits:
                                  cardDetail?.stop.toString().split(".")[1]
                                    ?.length || 0,
                                maximumFractionDigits:
                                  cardDetail?.stop.toString().split(".")[1]
                                    ?.length || 10,
                              })
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

                <div className="w-100 mt-3 font-xsss fw-400 text-start">
                  {description
                    ? description
                    : cardDetail?.description && cardDetail.description}
                </div>

                <div className={styles["signal-author"]}>
                  <div className={`${styles["signal-author__details"]} d-flex`}>
                    <div className="d-flex gap-2">
                      <div
                        className="d-flex flex-column position-relative"
                        style={{ marginBottom: "20px" }}
                      >
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

                          <div
                            className="d-flex flex-column mt-2 justify-content-center position-absolute"
                            style={{ bottom: "-24px", left: "-3px" }}
                          >
                            <h2 className="text-white fw-700 m-0">
                              <Tooltip title={authorName}>
                                <IconButton
                                  sx={{
                                    fontSize: "12px",
                                    color: "#fff",
                                    padding: "0",
                                    fontWeight: "700",
                                  }}
                                >
                                  {authorName.length > 20
                                    ? authorName.substring(0, 20) + "..."
                                    : authorName}
                                </IconButton>
                              </Tooltip>
                            </h2>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {readsCount !== null && brokerId ? (
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
                      <div className="d-flex" style={{ gap: "20px" }}>
                        <div
                          className={`${styles["signal-stats"]} d-flex flex-column font-xssss text-align`}
                        >
                          <div className="fw-400 position-relative">
                            {tSignal("accuracy")}
                            <Tooltip title={tBroker("signal_accuracy_tooltip")}>
                              <i
                                className="bi bi-info-circle position-absolute"
                                style={{
                                  top: "-2px",
                                  right: "-10px",
                                  fontSize: "10px",
                                }}
                              ></i>
                            </Tooltip>
                          </div>
                          <div className={styles["signal-stats__numbers"]}>
                            {!Number.isNaN(signalAccuracy) && signalAccuracy
                              ? +signalAccuracy % 1 !== 0
                                ? (+signalAccuracy).toFixed(2) + "%"
                                : +signalAccuracy + "%"
                              : !Number.isNaN(cardDetail?.signalAccuracy) &&
                                  cardDetail?.signalAccuracy
                                ? +cardDetail?.signalAccuracy % 1 !== 0
                                  ? (+cardDetail?.signalAccuracy).toFixed(2) +
                                    "%"
                                  : +cardDetail?.signalAccuracy + "%"
                                : "N/A"}
                          </div>
                        </div>
                        <div
                          className={`${styles["signal-stats"]} d-flex flex-column font-xssss text-align`}
                        >
                          <div className="fw-400">
                            {tBase("follower_title")}
                          </div>
                          <div className={styles["signal-stats__numbers"]}>
                            {followerNum >= 1000
                              ? (followerNum / 1000).toFixed(1)
                              : followerNum}{" "}
                            {followerNum >= 1000 ? "k" : ""}
                          </div>
                        </div>
                        <div
                          className={`${styles["signal-stats"]} d-flex flex-column font-xssss text-align`}
                        >
                          <div className="fw-400">{tBase("ratings")}</div>
                          <div className={styles["signal-stats__numbers"]}>
                            {avarageRating > 0
                              ? avarageRating.toFixed(1)
                              : avarageRating}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {((brokerId !== owner?.userId &&
                    brokerId !== cardDetail?.owner?.userId) ||
                    curUserId !== brokerId) && (
                    <button
                      className={`${isFollowing ? styles["follow-broker"] : styles["follow-btn"]} main-btn mt-2 mb-0 border-0 px-3 z-index-1 text-white cursor-pointer fw-500 ls-1`}
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
