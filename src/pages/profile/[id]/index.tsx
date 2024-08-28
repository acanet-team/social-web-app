import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import styles from "@/styles/modules/profile.module.scss";
import { TabPnum } from "@/types/enum";
import { About } from "@/app/components/profile/About";
import { Experience } from "@/app/components/profile/Experience";
import Education from "@/app/components/profile/Education";
import AISummary from "@/app/components/profile/AISummary";
import License from "@/app/components/profile/License";
import { getProfile } from "@/api/profile";
import { useSession } from "next-auth/react";
import SocialMedia from "@/app/components/profile/SocialMedia";
import ModalEditBanner from "@/app/components/profile/ModalEditBanner";
import { useTranslations } from "next-intl";

export default function Profile({
  dataBrokerProfile,
  dataUserProfile,
  dataUser,
  followersCount,
  idParam,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("MyProfile");

  const formatNumber = (number: number): string => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  console.log("fsdfj");
  console.log(dataBrokerProfile);

  const numbersFollowers = formatNumber(followersCount);
  const [curTab, setCurTab] = useState<string>("about");
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(true);
  const [show, setShow] = useState(false);
  const [textHover, setTextHover] = useState(false);

  useEffect(() => {
    if (session) {
      setId(session?.user?.id);
    }
  }, [session]);

  useEffect(() => {
    if (Number(idParam) === id) {
      setRole(true);
    }
  }, [idParam, id]);

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === "Posts") {
      setCurTab("posts");
    } else if (chosenTab === "Communities") {
      setCurTab("communities");
    } else {
      setCurTab("about");
    }
  };

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const handleSubmit = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <>
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          borderRadius: "15px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
          }}
        >
          <Image
            src={
              dataUser?.profileCoverPhoto?.path ||
              "/assets/images/profile/u-bg.png"
            }
            width={1075}
            height={250}
            alt=""
            className="w__100"
            style={{
              objectFit: "cover",
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "15px",
            }}
          />
          <Image
            src={dataUser?.photo?.path || "/assets/images/profile/ava.png"}
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
                      This broker has been verified by Acanet
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
        <div className={`${styles["group-tabs"]}`}>
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.Posts ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>Posts</p>
          </div>
          {/* {dataUser.role.name === "broker" && ( */}
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.About ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>About</p>
          </div>
          {/* )} */}
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.Communities ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>Communities</p>
          </div>
        </div>
      </div>
      {curTab === TabPnum.About && (
        <div className="row">
          <div className="col-md-3 col-12">
            <div
              className="card p-4"
              style={{
                background: "#FFFFFF",
                paddingLeft: "16px",
                paddingRight: "16px",
                borderRadius: "15px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/assets/images/profile/image 2 (1).png"
                  width={48}
                  height={48}
                  alt=""
                  className=""
                  style={{
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p className="m-0 fw-700 font-xsss">Certified SSI Broker</p>
                </div>
              </div>
            </div>
            <AISummary
              role={role}
              dataBrokerProfile={dataBrokerProfile}
              dataUser={dataUser}
            />
            <SocialMedia role={role} dataBrokerProfile={dataBrokerProfile} />
          </div>
          <div className="col-md-9 col-12">
            <About role={role} dataBrokerProfile={dataBrokerProfile} />
            <Experience role={role} dataBrokerProfile={dataBrokerProfile} />
            <Education role={role} dataBrokerProfile={dataBrokerProfile} />
            <License role={role} dataBrokerProfile={dataBrokerProfile} />
          </div>
        </div>
      )}
      {show && (
        <ModalEditBanner
          handleClose={handleCancel}
          handleShow={handleOpenModal}
          title="Edit Banner"
          show={show}
        />
      )}
    </>
  );
}
export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
  const profileRes = await getProfile(id as string);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      dataBrokerProfile: profileRes?.data?.brokerProfile || [],
      dataUserProfile: profileRes?.data?.userProfile || [],
      dataUser: profileRes?.data?.user || [],
      followersCount: profileRes?.data?.followersCount,
      idParam: id,
    },
  };
}
