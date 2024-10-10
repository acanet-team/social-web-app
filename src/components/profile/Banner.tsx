import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { BrokerProfile, User, UserProfile } from "@/api/profile/model";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/profile.module.scss";
import { connectAInvestor, updateProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import { ImageCropModal } from "@/components/ImageCropModal";
import { createGetBrokersRequest, followABroker } from "@/api/onboard";
import Ratings from "@/components/Ratings";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@mui/material/Tooltip";
import DonateModal from "./DonateModal";
import { useWeb3 } from "@/context/wallet.context";
import { postConnectRequest, postConnectResponse } from "@/api/connect";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";

interface TabBannerProps {
  role: boolean;
  dataUser: User;
  idParam: string | undefined | string[];
  dataUserProfile: UserProfile;
  followersCount: number;
  followed: boolean;
  connectionCount: number;
  connectStatus: string;
  logoRank: string | null;
  connectRequestId: string | null;
}
const Banner: React.FC<TabBannerProps> = ({
  role,
  dataUser,
  idParam,
  dataUserProfile,
  followersCount,
  followed,
  connectionCount,
  connectStatus,
  logoRank,
  connectRequestId,
}) => {
  const t = useTranslations("MyProfile");
  const tRating = useTranslations("Rating");
  const tBase = useTranslations("Base");
  const tBroker = useTranslations("BrokerList");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDonate, setOpenDonate] = useState<boolean>(false);
  const { rateContract, connectWallet, account } = useWeb3();
  // console.log("ádaijf", dataUser.role.name ==="guest")
  const formatNumber = (number: number): string => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const [uploadedCoverImage, setUploadedCoverImage] = useState<File | null>(
    null,
  );
  const [uploadedAvatarImage, setUploadedAvatarImage] = useState<File | null>(
    null,
  );
  const [flCount, setFlCount] = useState(0);
  const [connectCount, setConnectCount] = useState(0);
  const [previewCover, setPreviewCover] = useState<string>(
    "/assets/images/profile/u-bg.png",
  );
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    "/assets/images/profile/ava.png",
  );
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const numbersFollowers = formatNumber(flCount);
  const [selectedImage, setSelectedImage] = useState("");
  const [openImageCrop, setOpenImageCrop] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  const [avarageRating, setAverageRating] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isFollowing, setIsFollowing] = useState<boolean>(followed);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [isRespond, setIsRespond] = useState<boolean>(false);
  const buttonRespondRef = useRef<HTMLButtonElement>(null);
  const groupRespondRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 440px" });
  const [connectionRequestId, setConnectionRequestId] = useState<string | null>(
    "",
  );

  useEffect(() => {
    setPreviewAvatar(dataUser?.photo?.path);
    setPreviewCover(dataUser?.profileCoverPhoto?.path);
    setFlCount(Number(followersCount));
    setConnectCount(Number(connectionCount));
    setConnectionStatus(connectStatus);
    setConnectionRequestId(connectRequestId);
  }, [
    dataUser,
    dataUserProfile,
    followersCount,
    connectionCount,
    connectStatus,
    connectRequestId,
  ]);

  const fetchAverageRating = async () => {
    try {
      const res = await rateContract.getAverageRating(dataUser.id.toString());
      const avgRating =
        res.brokerTotalScore.toNumber() / res.brokerRatingCount.toNumber() || 0;
      console.log("rate", res);
      setAverageRating(Number(avgRating));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchConnectRequest = async (id: number, action: string) => {
    try {
      await postConnectRequest(id, action);
      if (action === "request") {
        setConnectionStatus("request_send");
        console.log("request sent");
      } else if (action === "cancel_request") {
        setConnectionStatus("not_connected");
        console.log("not_connected");
      }
      // setIsPendingConnect(!isPendingConnect);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (selectedImage && imageType) {
      setOpenImageCrop(true);
    }
  }, [selectedImage, imageType]);

  useEffect(() => {
    fetchAverageRating();
  }, [dataUser.id]);

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onloadend = () => resolve(reader.result as string);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = event.target.files as FileList;
    if (!file) {
      return;
    }
    try {
      setImageType(type);
      const imgUrl = await fileToDataString(file?.[0] as File);
      setSelectedImage(imgUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    setOpenImageCrop(false);
    if (imageType === "avatar") {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
    if (imageType === "cover") {
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
    setImageType(null);
    setSelectedImage("");
  };

  const onCropped = async (image: File) => {
    const imgUrl = await fileToDataString(image);
    if (imageType === "avatar") {
      setUploadedAvatarImage(image);
      setPreviewAvatar(imgUrl);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
      submitBanner();
    }
    if (imageType === "cover") {
      setUploadedCoverImage(image);
      setPreviewCover(imgUrl);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
      submitBanner();
    }
    setOpenImageCrop(false);
    setImageType(null);
    setSelectedImage("");
  };

  const submitBanner = async () => {
    setIsLoading(true);
    try {
      const formDt = new FormData();
      if (uploadedCoverImage) {
        formDt.append("coverImage", uploadedCoverImage);
      }
      if (uploadedAvatarImage) {
        formDt.append("avatar", uploadedAvatarImage);
      }
      const dataUpdate = await updateProfile(formDt);
      setShow(false);
      throwToast("About updated successfully", "success");
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onFollowBrokerHandler = async (e: any, brokerId: number) => {
    setIsFollowing(!isFollowing);
    followABroker({
      userId: brokerId,
      followType: isFollowing ? "UNFOLLOW" : "FOLLOW",
    });
    if (!isFollowing) {
      setFlCount((prevState) => prevState + 1);
    } else {
      setFlCount((prevState) => prevState - 1);
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = useCallback(() => {
    setOpenDonate(false);
  }, []);

  const onDonateHandler = () => {
    if (!account) {
      return connectWallet();
    }
    setOpenDonate(true);
  };

  const fetchConnectResponse = async (
    requestId: string,
    action: string,
    idNoti: string,
  ) => {
    setIsLoading(true);
    try {
      await postConnectResponse(requestId, action);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !buttonRespondRef?.current?.contains(event.target as Node) &&
      !groupRespondRef?.current?.contains(event.target as Node)
    ) {
      setIsRespond(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="px-3">
      <div className="w__100 position-relative">
        <div className={`${styles["cover-profile"]}`}>
          <Image
            src={
              previewCover ? previewCover : `/assets/images/default-upload.jpg`
            }
            width={960}
            height={250}
            alt=""
            className={`${styles["cover-profile-img"]}`}
            style={{
              objectFit: "cover",
              borderTopRightRadius: "5px",
              borderTopLeftRadius: "5px",
            }}
          />
          {role === true && (
            <>
              <label htmlFor="cover" className="cursor-pointer">
                <i
                  className={`${styles["image-edit__btn"]} ${styles["cover-image-edit__btn"]} bi bi-camera m-0 position-absolute`}
                ></i>
              </label>
              <input
                id="cover"
                ref={coverInputRef}
                className="visually-hidden"
                type="file"
                onChange={(e) => handleFileChange(e, "cover")}
                accept="image/*"
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        <div className={styles["profile-avatar"]}>
          <div className={`${styles["ava-profile"]}`}>
            <Image
              src={
                previewAvatar ? previewAvatar : `/assets/images/profile/ava.png`
              }
              width={119}
              height={119}
              alt={dataUserProfile?.nickName}
              className={`${dataUser.role.name === "broker" ? styles["broker-ava__effect"] : ""} ${styles["ava-profile-img"]} rounded-circle`}
              onError={() => setPreviewAvatar("/assets/images/profile/ava.png")}
            />
            {/* {dataUser.role.name === "broker" && <FontAwesomeIcon
              icon={faCircleCheck}
              size="xl"
              style={{ color: "#249c09" }}
              className={styles['broker-ava__mark']}
            />} */}
            {role === true && (
              <>
                <label htmlFor="avatar" className="cursor-pointer">
                  <i
                    className={`bi bi-camera ${styles["icon-profile"]} ${styles["image-edit__btn"]} m-0 position-absolute right-0 bottom-0`}
                  ></i>
                </label>
                <input
                  id="avatar"
                  ref={avatarInputRef}
                  className="visually-hidden"
                  type="file"
                  onChange={(e) => handleFileChange(e, "avatar")}
                  accept="image/*"
                  style={{ display: "none", margin: "auto" }}
                />
              </>
            )}
          </div>
        </div>
        {openImageCrop && (
          <ImageCropModal
            isOpen={openImageCrop}
            onCancel={onCancel}
            cropped={onCropped}
            imageUrl={selectedImage}
            aspect={imageType === "cover" ? 960 / 250 : 119 / 119}
          />
        )}
      </div>
      <div className={styles["banner-info"]}>
        <div
          style={{
            marginTop: "10px",
          }}
          className="w-100 d-flex flex-sm-row flex-column justify-content-between align-items-sm-start align-items-center"
        >
          <div className="">
            <div
              className="d-flex align-items-sm-start align-items-center flex-md-row flex-column gap-md-3 gap-2 mb-2"
              style={{
                marginTop: "30px",
              }}
            >
              <div className="d-flex flex-column align-items-center align-items-sm-start">
                <h2 className={`m-0 fw-700 font-md ${styles["profile-name"]}`}>
                  {dataUser?.firstName} {dataUser?.lastName}
                </h2>
                <div className="font-xsss text-grey-600 m-0">
                  @{dataUserProfile?.nickName}
                </div>
              </div>
              <div
                className="d-flex align-items-center justify-content-center justify-content-sm-start "
                style={{ minWidth: "220px" }}
              >
                {dataUser.role.name === "broker" && (
                  <div className="align-items-center position-relative d-flex">
                    <Image
                      src="/assets/images/profile/check-mark.svg"
                      width={24}
                      height={24}
                      alt="logo"
                    />
                    <p
                      className="font-xss fw-600 m-0 ms-1"
                      style={{ color: "rgb(107, 173, 97)" }}
                    >
                      {t("Certified Broker")}
                    </p>
                    <Tooltip
                      title={t("This broker has been verified by Acanet")}
                    >
                      <Image
                        src="/assets/images/profile/verified-tooltip.svg"
                        width={16}
                        height={16}
                        alt=""
                        className="position-absolute top-0 rounded-circle right--20 top-5"
                        style={{
                          color: "rgb(107, 173, 97)",
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`${styles["profile-followers"]} font-xss fw-500 text-grey-600 text-center text-sm-start`}
            >
              {dataUser?.role?.name === "broker"
                ? numbersFollowers
                : (dataUser?.role?.name === "investor" ||
                    dataUser.role.name === "guest") &&
                  formatNumber(connectCount)}{" "}
              {dataUser?.role?.name === "broker"
                ? Number(numbersFollowers) > 1
                  ? t("followers")
                  : tBase("follower")
                : (dataUser?.role?.name === "investor" ||
                    dataUser.role.name === "guest") &&
                  (Number(connectCount) < 1 ? t("connect") : t("connects"))}
            </div>
            {!role && (
              <>
                <div className="d-flex flex-wrap gap-sm-3 gap-2 mt-3 justify-content-sm-start justify-content-center">
                  {dataUser.role.name === "broker" &&
                    connectionStatus !== "connected" &&
                    connectionStatus !== "request_received" && (
                      <>
                        <button
                          onClick={(e) => onFollowBrokerHandler(e, dataUser.id)}
                          className={`px-3 ${isFollowing ? styles["profile-following__btn"] : styles["profile-follow__btn"]} ${styles["profile-banner__btn"]}`}
                        >
                          {isFollowing ? (
                            <h4 className="m-0">
                              <i
                                className={`bi bi-check ${styles["icon-profie-bg-blue"]} cursor-pointer`}
                              ></i>
                            </h4>
                          ) : (
                            <h4 className="m-0">
                              <i
                                className={`bi bi-plus ${styles["icon-profile"]} cursor-pointer`}
                              ></i>
                            </h4>
                          )}

                          <span className="font-xss fw-600">
                            {isFollowing ? t("following") : t("follow")}
                          </span>
                        </button>
                      </>
                    )}

                  {(dataUser.role.name === "investor" ||
                    connectionStatus === "connected" ||
                    dataUser.role.name === "guest") &&
                    connectionStatus !== "request_received" && (
                      <>
                        <button
                          onClick={() =>
                            fetchConnectRequest(
                              Number(idParam),
                              connectionStatus === "not_connected"
                                ? "request"
                                : connectionStatus === "request_send"
                                  ? "cancel_request"
                                  : "",
                            )
                          }
                          className={`px-3 ${connectionStatus === "connected" ? styles["profile-following__btn"] : styles["profile-follow__btn"]} ${styles["profile-banner__btn"]}`}
                        >
                          {connectionStatus === "connected" ? (
                            <h4 className=" m-0">
                              <i
                                style={{ color: "white" }}
                                className={`bi bi-check ${styles["icon-profile"]} cursor-pointer`}
                              ></i>
                            </h4>
                          ) : (
                            <h4 className="text-white m-0">
                              <i
                                className={`bi bi-plus ${styles["icon-profile"]} cursor-pointer`}
                              ></i>
                            </h4>
                          )}

                          <span className="font-xss fw-600">
                            {connectionStatus === "connected"
                              ? t("connecting")
                              : connectionStatus === "not_connected"
                                ? t("Connect")
                                : connectionStatus === "request_send"
                                  ? t("waiting")
                                  : ""}
                          </span>
                        </button>
                      </>
                    )}
                  {!isMobile
                    ? connectionStatus === "request_received" && (
                        <div style={{ position: "relative" }}>
                          <button
                            ref={buttonRespondRef}
                            onClick={() => setIsRespond(!isRespond)}
                            className={`px-3 ${styles["profile-following__btn"]} ${styles["profile-banner__btn"]}`}
                          >
                            <h4 className="m-0">
                              <i
                                className={`bi bi-person ${styles["icon-profie-bg-blue"]} cursor-pointer`}
                              ></i>
                            </h4>
                            <span className="font-xss fw-600">
                              {t("Respond")}
                            </span>
                          </button>
                          {isRespond && (
                            <div
                              ref={groupRespondRef}
                              className={`card ${styles["group-buttons-banner-response"]}`}
                              style={{
                                display: isRespond ? "block" : "none",
                              }}
                            >
                              <button
                                className={`px-3 ${styles["button-banner-response"]}`}
                                onClick={() => {
                                  if (connectionRequestId) {
                                    fetchConnectResponse(
                                      connectionRequestId,
                                      "reject",
                                      String(idParam),
                                    );
                                  }
                                  setConnectionStatus("connected");
                                }}
                              >
                                <p className={`font-xss fw-600 m-0`}>
                                  {t("confirm")}
                                </p>
                              </button>
                              <button
                                className={`px-3 ${styles["button-banner-response"]}`}
                                onClick={() => {
                                  if (connectionRequestId) {
                                    fetchConnectResponse(
                                      connectionRequestId,
                                      "reject",
                                      String(idParam),
                                    );
                                  }
                                  setConnectionStatus("'not_connected");
                                }}
                              >
                                <p className="font-xss fw-600 m-0">
                                  {t("delete")}
                                </p>
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    : connectionStatus === "request_received" && (
                        <>
                          <button
                            className={`px-3 ${styles["profile-follow__btn"]} ${styles["profile-banner__btn"]}`}
                          >
                            <h4 className="m-0">
                              <i
                                className={`bi bi-check ${styles["icon-profile"]} cursor-pointer`}
                              ></i>
                            </h4>
                            <p
                              className={`font-xss fw-600 m-0`}
                              onClick={() => {
                                if (connectionRequestId) {
                                  fetchConnectResponse(
                                    connectionRequestId,
                                    "reject",
                                    String(idParam),
                                  );
                                }
                                setConnectionStatus("connected");
                              }}
                            >
                              {t("confirm")}
                            </p>
                          </button>
                          <button
                            className={`px-3 ${styles["profile-following__btn"]} ${styles["profile-banner__btn"]}`}
                          >
                            <h4 className="m-0">
                              <i
                                className={`bi bi-x ${styles["icon-profie-bg-blue"]} cursor-pointer`}
                              ></i>
                            </h4>
                            <p
                              className="font-xss fw-600 m-0"
                              onClick={() => {
                                if (connectionRequestId) {
                                  fetchConnectResponse(
                                    connectionRequestId,
                                    "reject",
                                    String(idParam),
                                  );
                                }
                                setConnectionStatus("'not_connected");
                              }}
                            >
                              {t("delete")}
                            </p>
                          </button>
                        </>
                      )}
                  {dataUser.role.name === "broker" &&
                    dataUser.walletAddress && (
                      <button
                        className={`${styles["profile-donate__btn"]} ${styles["profile-banner__btn"]} btn`}
                        onClick={() => setOpenDonate(true)}
                      >
                        <h4 className="m-0">
                          <i className="bi bi-cash-coin text-success me-1"></i>
                          <span>{t("donate")}</span>
                        </h4>
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
          {dataUser.role.name === "broker" && (
            <div className="ms-sm-auto d-flex flex-column align-items-center justify-content-center mt-3 me-sm-4 me-0">
              {logoRank && (
                <>
                  <Image
                    width={84}
                    height={93}
                    alt="logo-rank"
                    src={logoRank}
                  />
                  <Link
                    href={t("link")}
                    className="font-xssss cursor-pointer"
                    style={{ textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("View ranking scheme")}{" "}
                    <i
                      className={`bi bi-arrow-right ${styles["icon-profile"]} cursor-pointer`}
                    ></i>
                  </Link>
                </>
              )}
              {/* Rank image */}
              <div
                className="font-xsss fw-600 m-0 ms-1 position-relative"
                style={{ color: "rgb(107, 173, 97)" }}
              >
                {!isNaN(Number(dataUserProfile?.signalAccuracy)) &&
                  dataUserProfile?.signalAccuracy && (
                    <Tooltip title={tBroker("signal_accuracy_tooltip")}>
                      <Image
                        src="/assets/images/profile/verified-tooltip.svg"
                        width={16}
                        height={16}
                        alt=""
                        className="position-absolute top-0"
                        style={{
                          right: "-20px",
                          top: "5px",
                          borderRadius: "50%",
                          color: "rgb(107, 173, 97)",
                        }}
                      />
                    </Tooltip>
                  )}
                {!isNaN(Number(dataUserProfile?.signalAccuracy)) &&
                  dataUserProfile?.signalAccuracy +
                    "% " +
                    tBroker("signal_accuracy")}
              </div>
              <Ratings rating={avarageRating} size={18} />
              <div className={`fw-bold ${styles["profile-rating__average"]}`}>
                Rating: {avarageRating.toFixed(1)}
              </div>
              <div
                style={{ fontSize: "13px" }}
                className="text-grey-600 text-center"
              >
                {tRating("rank_desc")}
              </div>
              <div
                style={{ fontSize: "13px" }}
                className="text-grey-600 text-center"
              >
                {tRating("rank_desc_guarantee")}
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="border-none mt-3 border-top-md" />
      {openDonate && (
        <DonateModal
          handleClose={handleClose}
          show={openDonate}
          brokerData={dataUser as User}
        />
      )}
    </div>
  );
};

export default Banner;
