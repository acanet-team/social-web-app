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
import type { IUserInfo } from "@/api/community/model";
interface TabBannerProps {
  role: boolean;
  dataUser: User;
  idParam: string | undefined | string[];
  dataUserProfile: UserProfile;
  followersCount: number;
  followed: boolean;
}
const Banner: React.FC<TabBannerProps> = ({
  role,
  dataUser,
  idParam,
  dataUserProfile,
  followersCount,
  followed,
}) => {
  const t = useTranslations("MyProfile");
  const tRating = useTranslations("Rating");
  const tBase = useTranslations("Base");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDonate, setOpenDonate] = useState<boolean>(false);
  const { rateContract, connectWallet } = useWeb3();
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
  const numbersConnects = formatNumber(connectCount);
  const [selectedImage, setSelectedImage] = useState("");
  const [openImageCrop, setOpenImageCrop] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [avarageRating, setAverageRating] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isFollowing, setIsFollowing] = useState<boolean>(followed);
  const [isConnectStatus, setIsConnectStatus] = useState<string>("CONNECT");

  useEffect(() => {
    setPreviewAvatar(dataUser?.photo?.path);
    setPreviewCover(dataUser?.profileCoverPhoto?.path);
    setFlCount(Number(followersCount));
  }, [dataUser, dataUserProfile, followersCount]);

  const fetchAverageRating = async () => {
    try {
      const res = await rateContract.getAverageRating(dataUser.id.toString());
      const avgRating =
        res.brokerTotalScore.toNumber() / res.brokerRatingCount.toNumber() || 0;
      setAverageRating(Number(avgRating));
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
      console.log("ahsfa", dataUpdate);
      throwToast("About updated successfully", "success");
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getBrokers() {
      try {
        setIsLoading(true);
        const res = await createGetBrokersRequest(page, 20);
        setBrokers(res.data.docs ? res.data.docs : res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getBrokers();
  }, []);

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

  const onConnectInvestorHandler = async (e: any, investorId: number) => {
    setIsConnectStatus("Waiting");
    connectAInvestor({
      userId: investorId,
      connectStatus: "",
      // connectType: isConnecting? "UNCONNECT" : "CONNECT",
    });
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = useCallback(() => {
    setOpenDonate(false);
  }, []);

  return (
    <div style={{ paddingRight: "16px", paddingLeft: "16px" }}>
      <div
        className=""
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
        }}
      >
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
          <div className="w-100">
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
                  <div
                    className="align-items-center position-relative"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "2px",
                    }}
                  >
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
                        className="position-absolute top-0"
                        style={{
                          right: "-20px",
                          top: "5px",
                          borderRadius: "50%",
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
                : dataUser?.role?.name === "investor" && numbersConnects}{" "}
              {dataUser?.role?.name === "broker"
                ? Number(numbersFollowers) > 1
                  ? t("followers")
                  : tBase("follower")
                : dataUser?.role?.name === "investor" &&
                  (Number(numbersConnects) > 1 ? t("connect") : t("connects"))}
            </div>
          </div>
          {dataUser.role.name === "broker" && (
            <div className="ms-sm-auto d-flex flex-column align-items-center justify-content-center mt-3 me-sm-4 me-0">
              {/* Rank image */}
              {/* <i className="bi bi-patch-check h1 m-0"></i> */}
              <Ratings rating={avarageRating} size={18} />
              <div className={`fw-bold ${styles["profile-rating__average"]}`}>
                Rating: {avarageRating}
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

        {!role && (
          <div className="d-flex flex-wrap gap-sm-3 gap-2 mt-md-2 mt-3 mt-3 justify-content-sm-start justify-content-center">
            {dataUser.role.name === "broker" && (
              <>
                <button
                  onClick={(e) => onFollowBrokerHandler(e, dataUser.id)}
                  className={`px-3 ${isFollowing ? styles["profile-following__btn"] : styles["profile-follow__btn"]} ${styles["profile-banner__btn"]}`}
                >
                  {isFollowing ? (
                    <h4 className="text-white m-0">
                      <i
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
                    {isFollowing ? t("following") : t("follow")}
                  </span>
                </button>
              </>
            )}

            {dataUser.role.name === "broker" && dataUser.walletAddress && (
              <button
                className={`${styles["profile-donate__btn"]} ${styles["profile-banner__btn"]} btn`}
                onClick={() => setOpenDonate(true)}
              >
                <i className="bi bi-cash-coin text-success me-1"></i>
                <span>{t("donate")}</span>
              </button>
            )}

            {dataUser.role.name === "investor" && (
              <>
                <button
                  onClick={(e) => onConnectInvestorHandler(e, dataUser.id)}
                  className={`px-3 ${isConnectStatus === "CONNECTING" ? styles["profile-following__btn"] : styles["profile-follow__btn"]} ${styles["profile-banner__btn"]}`}
                >
                  {isConnectStatus === "CONNECTING" && (
                    <h4 className="text-white m-0">
                      <i
                        className={`bi bi-check ${styles["icon-profile"]} cursor-pointer`}
                      ></i>
                    </h4>
                  )}
                  {(isConnectStatus === "CONNECT" ||
                    isConnectStatus === "Waiting") && (
                    <h4 className="text-white m-0">
                      <i
                        className={`bi bi-plus ${styles["icon-profile"]} cursor-pointer`}
                      ></i>
                    </h4>
                  )}

                  <span className="font-xss fw-600">
                    {isConnectStatus === "CONNECTING"
                      ? t("connecting")
                      : isConnectStatus === "CONNECT"
                        ? t("Connect")
                        : t("waiting")}
                  </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #d1d1d1",
          marginTop: "20px",
        }}
      />
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
