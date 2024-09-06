import React, { useCallback, useState } from "react";
import Image from "next/image";
import type { BrokerProfile, User, UserProfile } from "@/api/profile/model";
import ModalEditBanner from "./ModalEditBanner";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/profile.module.scss";
interface TabBannerProps {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
  dataUser: User;
  idParam: string | undefined | string[];
  dataUserProfile: UserProfile;
  followersCount: number;
}
const Banner: React.FC<TabBannerProps> = ({
  dataBrokerProfile,
  role,
  dataUser,
  idParam,
  dataUserProfile,
  followersCount,
}) => {
  const t = useTranslations("MyProfile");
  const [textHover, setTextHover] = useState(false);
  const [show, setShow] = useState(false);
  const formatNumber = (number: number): string => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const numbersFollowers = formatNumber(followersCount);

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const [avatar, setAvatar] = useState(
    dataUser?.photo?.path || "/assets/images/profile/ava.png",
  );
  const [coverImg, setCoverImg] = useState(
    dataUser?.profileCoverPhoto?.path || "/assets/images/profile/u-bg.png",
  );

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
        }}
      >
        <Image
          src={coverImg}
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
        <Image
          src={avatar}
          width={119}
          height={119}
          alt={dataUserProfile?.nickName}
          className=""
          style={{
            objectFit: "cover",
            borderRadius: "100%",
            position: "absolute",
            bottom: "-30px",
            left: "30px",
            border: "4px solid white",
          }}
        />
      </div>
      <div style={{ marginLeft: "30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h2 className="m-0 fw-700 ">
                {dataUser?.lastName} {dataUser?.firstName}
              </h2>
              <div className="font-xssss text-gray">
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "2px",
                }}
              >
                <p className="font-xsss fw-400">Certified Broker</p>
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
                  }}
                />
                {textHover && (
                  <p className="text-hover font-xsssss">
                    {t("This broker has been verified by Acanet")}
                  </p>
                )}
              </div>
            </div>
          </div>
          {role === true && (
            <h4>
              <i
                className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                onClick={() => handleOpenModal()}
              ></i>
            </h4>
          )}
        </div>

        <div className="font-xsss fw-600 text-gray-follow">
          {numbersFollowers} followers
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <button
            className="px-3 bg-blue-button"
            style={{
              borderRadius: "16px",
              border: "0",
              display: "flex",
              flexDirection: "row",
              gap: "2px",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
            }}
          >
            <Image
              src="/assets/images/profile/add-small.png"
              width={16}
              height={16}
              alt=""
              className=""
              style={{
                objectFit: "cover",
              }}
            />
            <span className="text-white font-xss fw-600">{t("follow")}</span>
          </button>
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
              width: "120px",
            }}
          >
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
            <span className="text-blue-button font-xss fw-600">
              {t("messages")}
            </span>
          </button>
        </div>
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #d1d1d1",
          marginTop: "20px",
        }}
      />
      {show && (
        <ModalEditBanner
          handleClose={handleCancel}
          title="Edit Banner"
          show={show}
          avatar={avatar}
          coverImg={coverImg}
          id={idParam as string}
          dataBrokerProfile={dataBrokerProfile}
        />
      )}
    </div>
  );
};

export default Banner;
