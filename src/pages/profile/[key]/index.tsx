import React, { useEffect, useRef, useState } from "react";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import styles from "@/styles/modules/profile.module.scss";
import { TabPnum } from "@/types/enum";
import { getMyPosts, getProfile } from "@/api/profile";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { createGetAllTopicsRequest } from "@/api/onboard";
import TabPostProfile from "@/components/profile/TabPostProfile";
import TabGroupProfile from "@/components/profile/TabGroupProfile";
import TabAbout from "@/components/profile/TabAbout";
import Banner from "@/components/profile/Banner";
import TabRating from "@/components/profile/TabRating";
import ProfileSignal from "@/components/signal/ProfileSignal";
import TabNftProfile from "@/components/profile/TabNftProfile";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "next/navigation";

const TAKE = 10;

export default function Profile({
  dataBrokerProfile,
  dataUserProfile,
  dataUser,
  followersCount,
  idUser,
  interestTopic,
  ssi,
  followed,
  connectionCount,
  connectionStatus,
  logoRank,
  connectionRequestId,
  signalAccuracy,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("MyProfile");
  const [dtBrokerProfile, setDtBrokerProfile] = useState(dataBrokerProfile);
  const [dtUser, setDtUser] = useState(dataUser);
  const [dtUserProfile, setDtUserProfile] = useState(dataUserProfile);
  const [flCount, setFlCount] = useState(followersCount);
  const [fllowed, setFolowed] = useState(followed);
  const [connectCount, setConnectCount] = useState(connectionCount);
  const [listInterestTopic, setListInterestTopic] = useState(interestTopic);
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(false);
  const [initialFetch, setInitialFetch] = useState(false);
  const [switchTab, setSwitchTab] = useState<boolean>(false);
  const [curTab, setCurTab] = useState<string>("about");
  const [connectStatus, setConnectStatus] = useState(connectionStatus);
  const [logoRanks, setLogoRanks] = useState(logoRank);
  const [connectRequestId, setConnectRequestId] = useState(connectionRequestId);
  const isQuery = useMediaQuery({ query: "(max-width: 768px" });
  const params = useSearchParams();
  const currentTab = params?.get("tab") || "about";

  useEffect(() => {
    if (session) {
      setId(session?.user?.id);
    }
  }, [session]);

  useEffect(() => {
    if (Number(idUser) === id) {
      setRole(true);
    }
  }, [idUser, id]);

  useEffect(() => {
    if (curTab === "about" && switchTab) {
      fetchProfileData();
    }
    // setInitialFetch(false);
  }, [curTab]);

  // useEffect(() => {
  //   if (id) {
  //     fetchProfileData();
  //   }
  // }, [curTab]);

  useEffect(() => {
    if (!initialFetch) {
      setInitialFetch(true);
    }
  }, []);
  useEffect(() => {
    if (!switchTab) {
      setSwitchTab(true);
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchProfileData();
    }
  }, [idUser]);

  const fetchProfileData = async () => {
    try {
      const dtProfileRes = await getProfile(String(idUser));
      const interestTopicRes: any = await createGetAllTopicsRequest(1, 100);
      setDtBrokerProfile(dtProfileRes?.data?.brokerProfile || []);
      setDtUser(dtProfileRes?.data?.user || []);
      setDtUserProfile(dtProfileRes?.data?.userProfile || []);
      setListInterestTopic(interestTopicRes?.data.docs || []);
      setFlCount(dtProfileRes?.data?.followersCount || 0);
      setFolowed(dtProfileRes.data?.followed);
      setConnectCount(dtProfileRes?.data?.connectionsCount);
      setConnectStatus(dtProfileRes?.data?.connectionStatus);
      setLogoRanks(dtProfileRes?.data?.brokerProfile?.rank?.logo);
      setConnectRequestId(dtProfileRes?.data?.connectionRequestId);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (currentTab === "signal" && dtUser.role.name === "broker") {
      setCurTab("signal");
    } else if (currentTab === "posts") {
      setCurTab("posts");
    } else if (currentTab === "communities") {
      setCurTab("communities");
    } else if (currentTab === "rating" && dtUser.role.name === "broker") {
      setCurTab("rating");
    } else if (currentTab === "nft") {
      setCurTab("nft");
    } else {
      setCurTab("about");
    }
  }, [currentTab]);

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === t("Posts")) {
      setCurTab("posts");
    } else if (chosenTab === t("Communities")) {
      setCurTab("communities");
    } else if (chosenTab === t("About")) {
      setCurTab("about");
    } else if (chosenTab === t("Signal")) {
      setCurTab("signal");
    } else if (chosenTab === t("Nft")) {
      setCurTab("nft");
    } else {
      setCurTab("rating");
    }
  };

  const settingsilder = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: isQuery ? 2 : dataUser.role.name === "broker" ? 6 : 4,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: true,
    draggable: true,
    swipeToSlide: true,
  };

  let sliderRef = useRef<Slider | null>(null);
  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <div id={styles["user-profile"]}>
      <div
        className="card border-0 shadow-xss"
        style={{
          background: "#fff",
          paddingTop: "16px",
          borderRadius: "5px",
        }}
      >
        <Banner
          role={role}
          dataUser={dtUser}
          idParam={String(idUser)}
          dataUserProfile={dtUserProfile}
          followersCount={flCount}
          followed={fllowed}
          connectionCount={connectCount}
          connectStatus={connectStatus}
          logoRank={logoRanks}
          connectRequestId={connectRequestId}
          signalAccuracy={signalAccuracy}
        />
        <div className="position-relative">
          <Slider ref={sliderRef} {...settingsilder}>
            <div
              className={`${curTab === TabPnum.Posts ? styles["tab-active"] : ""} text-gray-follow d-flex justify-content-center fw-700`}
              style={{
                width: dtUser.role.name === "broker" ? "16.66%" : "25%",
              }}
            >
              <p
                className="cursor-pointer"
                onClick={(e) => onSelectTabHandler(e)}
              >
                {t("Posts")}
              </p>
            </div>
            {(dtUser.role.name === "broker" ||
              dtUser.role.name === "guest" ||
              dtUser.role.name === "investor") && (
              <div
                className={`${curTab === TabPnum.About ? styles["tab-active"] : ""} text-gray-follow d-flex justify-content-center fw-700`}
                style={{
                  width: dtUser.role.name === "broker" ? "16.66%" : "25%",
                }}
              >
                <p
                  className="cursor-pointer"
                  onClick={(e) => onSelectTabHandler(e)}
                >
                  {t("About")}
                </p>
              </div>
            )}
            <div
              className={`${curTab === TabPnum.Communities ? styles["tab-active"] : ""} text-gray-follow d-flex justify-content-center fw-700`}
              style={{
                width: dtUser.role.name === "broker" ? "16.66%" : "25%",
              }}
            >
              <p
                className="cursor-pointer"
                onClick={(e) => onSelectTabHandler(e)}
              >
                {t("Communities")}
              </p>
            </div>
            {dtUser.role.name === "broker" && (
              <div
                className={`${curTab === TabPnum.Rating ? styles["tab-active"] : ""} text-gray-follow d-flex justify-content-center fw-700`}
                style={{
                  width: dtUser.role.name === "broker" ? "16.66%" : "25%",
                }}
              >
                <p
                  className="cursor-pointer"
                  onClick={(e) => onSelectTabHandler(e)}
                >
                  {t("Rating")}
                </p>
              </div>
            )}
            {dtUser.role.name === "broker" && (
              <div
                className={` ${curTab === TabPnum.Signal ? styles["tab-active"] : ""} text-gray-follow d-flex justify-content-center fw-700`}
                style={{
                  width: dtUser.role.name === "broker" ? "16.66%" : "25%",
                }}
              >
                <p
                  className="cursor-pointer"
                  onClick={(e) => onSelectTabHandler(e)}
                >
                  {t("Signal")}
                </p>
              </div>
            )}
            <div
              className={`${styles["button-tab"]} ${curTab === TabPnum.Nft ? styles["tab-active"] : ""} text-gray-follow d-flex justify-content-center fw-700`}
              style={{
                width: dtUser.role.name === "broker" ? "16.66%" : "25%",
              }}
            >
              <p
                className="cursor-pointer"
                onClick={(e) => onSelectTabHandler(e)}
              >
                {t("Nft")}
              </p>
            </div>
          </Slider>
          {isQuery && (
            <i
              className={`bi bi-caret-left position-absolute cursor-pointer ${styles["slick-next"]}`}
              onClick={previous}
            ></i>
          )}
          {isQuery && (
            <i
              className={`bi bi-caret-right position-absolute cursor-pointer ${styles["slick-prev"]}`}
              onClick={next}
            ></i>
          )}
        </div>
      </div>
      {curTab === TabPnum.About && (
        <TabAbout
          ssi={ssi}
          dataBrokerProfile={dtBrokerProfile}
          dataUser={dtUser}
          interestTopic={listInterestTopic}
          idParam={String(idUser)}
        />
      )}
      {curTab === TabPnum.Posts && (
        <TabPostProfile
          id={String(idUser)}
          take={TAKE}
          isConnected={connectStatus === "connected"}
          isBroker={dtUser.role.name === "broker"}
          role={role}
        />
      )}
      {curTab === TabPnum.Communities && (
        <TabGroupProfile
          isBroker={dtUser.role.name === "broker"}
          // communities={dataMyGroups}
          communityType={dtUser.role.name === "broker" ? "owned" : "following"}
          take={TAKE}
          id={Number(idUser)}
        />
      )}
      {id === dataUser.id && curTab === TabPnum.Nft && (
        <TabNftProfile user={dtUser} idParam={String(idUser)} />
      )}
      {dtUser.role.name === "broker" && curTab === TabPnum.Rating && (
        <TabRating brokerData={dtUser} />
      )}
      {dtUser.role.name === "broker" && curTab === TabPnum.Signal && (
        <ProfileSignal brokerId={dtUser.id} userId={id} />
      )}
    </div>
  );
}
export async function getServerSideProps(context: NextPageContext) {
  const { key } = context.query;
  if (!key) {
    return {
      notFound: true,
    };
  }
  const profileRes = await getProfile(key as string);
  console.log("profileRes", profileRes?.data);
  const idUser = profileRes?.data?.user?.id;
  const interestTopic: any = await createGetAllTopicsRequest(1, 100);
  const signalAccuracy = profileRes?.data?.signalAccuracy;
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      dataBrokerProfile: profileRes?.data?.brokerProfile || [],
      dataUserProfile: profileRes?.data?.userProfile || [],
      dataUser: profileRes?.data?.user || [],
      followersCount: profileRes?.data?.followersCount,
      followed: profileRes?.data?.followed,
      connectionCount: profileRes?.data?.connectionsCount,
      connectionStatus: profileRes?.data?.connectionStatus,
      ssi: profileRes?.data?.ssi || null,
      idUser: idUser,
      interestTopic: interestTopic?.data.docs || [],
      userUsername: key || "",
      logoRank: profileRes?.data?.brokerProfile?.rank?.logo || null,
      connectionRequestId: profileRes?.data?.connectionRequestId || null,
      signalAccuracy: signalAccuracy,
    },
  };
}
