import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { BrokerProfile, User, UserProfile } from "@/api/profile/model";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/profile.module.scss";
import { updateProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import { ImageCropModal } from "@/components/ImageCropModal";
import { createGetBrokersRequest, followABroker } from "@/api/onboard";
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
  const [textHover, setTextHover] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [previewCover, setPreviewCover] = useState<string>(
    "/assets/images/profile/u-bg.png",
  );
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    "/assets/images/profile/ava.png",
  );

  useEffect(() => {
    setPreviewAvatar(dataUser?.photo?.path);
    setPreviewCover(dataUser?.profileCoverPhoto?.path);
    setFlCount(Number(followersCount));
  }, [dataUser, dataUserProfile, followersCount]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const numbersFollowers = formatNumber(flCount);

  const [selectedImage, setSelectedImage] = useState("");
  const [openImageCrop, setOpenImageCrop] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isFollowing, setIsFollowing] = useState<boolean>(followed);

  useEffect(() => {
    if (selectedImage && imageType) {
      setOpenImageCrop(true);
    }
  }, [selectedImage, imageType]);

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
        console.log("Success", brokers);
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
        <Image
          src={
            previewCover ? previewCover : `/assets/images/default-upload.jpg`
          }
          width={1075}
          height={250}
          alt=""
          className="w__100"
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

        <div style={{ position: "absolute", bottom: "-30px", left: "30px" }}>
          <Image
            src={
              previewAvatar
                ? previewAvatar
                : `/assets/images/default-avatar.jpg`
            }
            width={119}
            height={119}
            alt={dataUserProfile?.nickName}
            className=""
            style={{
              objectFit: "cover",
              borderRadius: "100%",

              border: "4px solid white",
            }}
          />
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
        {openImageCrop && (
          <ImageCropModal
            isOpen={openImageCrop}
            onCancel={onCancel}
            cropped={onCropped}
            imageUrl={selectedImage}
            aspect={imageType === "cover" ? 960 / 250 : 1}
          />
        )}
      </div>
      <div style={{ marginLeft: "30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "10px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <div>
              <h2 className="m-0 fw-700 font-md">
                {dataUser?.lastName} {dataUser?.firstName}
              </h2>
              <div className="font-xsss text-gray m-0">
                @{dataUserProfile?.nickName}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2px",
              }}
            >
              <Image
                src="/assets/images/profile/icons8-tick-192.png"
                width={24}
                height={24}
                alt=""
                className=""
                style={{
                  objectFit: "cover",
                }}
              />
              {dataUser.role.name === "broker" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                  }}
                >
                  <p className="font-xss fw-400 m-0">{t("Certified Broker")}</p>
                  <Image
                    onMouseEnter={() => setTextHover(true)}
                    onMouseLeave={() => setTextHover(false)}
                    src="/assets/images/profile/icons8-info-50.png"
                    width={13}
                    height={13}
                    alt=""
                    className=""
                    style={{
                      objectFit: "cover",
                      backgroundColor: "white",
                    }}
                  />
                  {textHover && (
                    <p className="text-hover font-xssss">
                      {t("This broker has been verified by Acanet")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="font-xss fw-600 text-gray-follow">
          {numbersFollowers} {t("followers")}
        </div>
        {!role && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {dataUser.role.name === "broker" && (
              <>
                <button
                  onClick={(e) => onFollowBrokerHandler(e, dataUser.id)}
                  className="px-3 "
                  style={{
                    backgroundColor: isFollowing ? "#0A66C2" : "#34465d",
                    borderRadius: "16px",
                    border: "0",
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "155px",
                  }}
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
                    // <Image
                    //   src="/assets/images/profile/add-small.png"
                    //   width={16}
                    //   height={16}
                    //   alt=""
                    //   className=""
                    //   style={{
                    //     objectFit: "cover",
                    //   }}
                    // />
                  )}

                  <span className="text-white font-xss fw-600">
                    {isFollowing ? t("following") : t("follow")}
                  </span>
                </button>
              </>
            )}
            <button
              className="px-3 bg-white"
              style={{
                borderRadius: "16px",
                borderColor: "#0A66C2",
                display: "flex",
                flexDirection: "row",
                gap: "2px",
                alignItems: "center",
                justifyContent: "center",
                width: "155px",
              }}
            >
              {/* <h4 className="text-blue-button m-0" > 
                <i style={{width:"10px", height:"10px"}}
                  className={`bi bi-send ${styles["icon-profile"]} cursor-pointer`}
                ></i>
              </h4> */}
              <Image
                src="/assets/images/profile/send-privately-small.png"
                width={16}
                height={16}
                alt=""
                className=""
                style={{
                  objectFit: "cover",
                }}
              />
              <div className="text-blue-button font-xss fw-600">
                {t("messages")}
              </div>
            </button>
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
    </div>
  );
};

export default Banner;
