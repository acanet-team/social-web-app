import React, { useEffect, useState } from "react";
import Image from "next/image";
import RootLayout from "@/layout/root";
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

export default function Profile({
  // dataBrokerProfile,
  // dataUserProfile,
  // dataUser,
  // followersCount,
  idParam,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log("555555555");
  // console.log(dataBrokerProfile);
  // console.log(dataUserProfile);
  console.log(idParam);
  const formatNumber = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // const numbersFollowers = formatNumber(followersCount);
  const numbersFollowers = formatNumber(15106);
  const [curTab, setCurTab] = useState<string>("about");
  const { data: session } = useSession() as any;
  const [id, setId] = useState();

  useEffect(() => {
    if (session) {
      setId(session?.user?.id);
    }
  }, [session]);

  console.log(id);

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

  return (
    <RootLayout>
      <div
        className="main-content right-chat-active nunito-font"
        id={styles.home}
      >
        <div className="middle-sidebar-bottom">
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
                src="/assets/images/profile/u-bg.png"
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
                // src={
                //   dataUser?.photo?.path || "/assets/images/profile/user-12.png"
                // }
                src={"/assets/images/profile/user-12.png"}
                width={119}
                height={119}
                // alt={dataUserProfile?.nickName}
                alt=""
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
                      {/* {dataUser?.lastName} {dataUser?.firstName} */}
                      Trịnh Văn Quyết
                    </h2>
                    <div className="font-xssss text-gray">
                      {/* @{dataUserProfile?.nickName} */}
                      nickname
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
                      src="/assets/images/profile/image 2.png"
                      width={24}
                      height={24}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                        borderRadius: "100%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <p className="font-xsss fw-400">Certified Broker</p>
                      <Image
                        src="/assets/images/profile/image 3.png"
                        width={13}
                        height={13}
                        alt=""
                        className=""
                        style={{
                          objectFit: "cover",
                          borderRadius: "100%",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                  ></i>
                </h4>
                {/* <Image
                  src="/assets/images/profile/icons8-edit-100 6.png"
                  width={20}
                  height={20}
                  alt=""
                  className=""
                  style={{
                    objectFit: "cover",
                  }}
                /> */}
              </div>

              {/* <p className="m-0 font-xss fw-400">Stock Broker</p> */}
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
                  <span className="text-white font-xss fw-600">Follow</span>
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
                    Message
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
                      <p className="m-0 fw-700 font-xsss">
                        Certified SSI Broker
                      </p>
                      <p className="m-0 font-xsssss   lh-12 text-gray-follow">
                        2019 - now
                      </p>
                    </div>
                  </div>
                </div>
                <AISummary />
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
                      justifyContent: "space-between",
                    }}
                  >
                    <p className="m-0 mb-1 fw-700 font-xssss">Social Medias</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "4px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <Image
                        src="/assets/images/profile/icons8-plus-100 3.png"
                        width={25}
                        height={25}
                        alt=""
                        className=""
                        style={{
                          objectFit: "cover",
                        }}
                      /> */}
                      <h1>
                        <i
                          className={`bi bi-plus-lg ${styles["icon-profile"]}`}
                        ></i>
                      </h1>
                      <h4>
                        <i
                          className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                        ></i>
                      </h4>
                      {/* <Image
                        src="/assets/images/profile/icons8-edit-100 6.png"
                        width={15}
                        height={15}
                        alt=""
                        className=""
                        style={{
                          objectFit: "cover",
                        }}
                      /> */}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    <Image
                      src="/assets/images/profile/zalo.png"
                      width={16}
                      height={16}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <Image
                      src="/assets/images/profile/zalo.png"
                      width={16}
                      height={16}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <Image
                      src="/assets/images/profile/zalo.png"
                      width={16}
                      height={16}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <Image
                      src="/assets/images/profile/zalo.png"
                      width={16}
                      height={16}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <Image
                      src="/assets/images/profile/zalo.png"
                      width={16}
                      height={16}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <Image
                      src="/assets/images/profile/zalo.png"
                      width={16}
                      height={16}
                      alt=""
                      className=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-9 col-12">
                <About />
                {/* <Experience dataBrokerProfile={dataBrokerProfile} />
                <Education dataBrokerProfile={dataBrokerProfile} />
                <License dataBrokerProfile={dataBrokerProfile} /> */}
                <Experience />
                <Education />
                <License />
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
  // console.log("id", id);
  // const profileRes = await getProfile(id as string);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      // dataBrokerProfile: profileRes?.data?.brokerProfile || [],
      // dataUserProfile: profileRes?.data?.userProfile || [],
      // dataUser: profileRes?.data?.user || [],
      // followersCount: profileRes?.data?.followersCount,
      idParam: id,
    },
  };
}
