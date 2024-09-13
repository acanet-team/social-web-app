import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import styles from "@/styles/modules/profile.module.scss";
import { TabPnum } from "@/types/enum";
import { getMyGroups, getMyPosts, getProfile } from "@/api/profile";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { createGetAllTopicsRequest } from "@/api/onboard";
import TabPostProfile from "@/components/profile/TabPostProfile";
import TabGroupProfile from "@/components/profile/TabGroupProfile";
import TabAbout from "@/components/profile/TabAbout";
import Banner from "@/components/profile/Banner";
import TabRating from "@/components/profile/TabRating";
import Wallet from "@/components/wallets/Wallet";

const TAKE = 10;

export default function Profile({
  dataBrokerProfile,
  dataUserProfile,
  dataUser,
  followersCount,
  idUser,
  interestTopic,
  myPosts,
  totalPage,
  page,
  userUsername,
  // dataMyGroups,
  // curPageGroup,
  // allPageGroup,
  ssi,
  followed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("MyProfile");
  const [dtBrokerProfile, setDtBrokerProfile] = useState(dataBrokerProfile);
  const [dtUser, setDtUser] = useState(dataUser);
  const [dtUserProfile, setDtUserProfile] = useState(dataUserProfile);
  const [flCount, setFlCount] = useState(followersCount);
  const [fllowed, setFolowed] = useState(followed);
  const [listInterestTopic, setListInterestTopic] = useState(interestTopic);
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(false);
  const [initialFetch, setInitialFetch] = useState(false);
  const [switchTab, setSwitchTab] = useState<boolean>(false);
  const [curTab, setCurTab] = useState<string>();

  useEffect(() => {
    if (session) {
      console.log("seeee", session);
      setId(session?.user?.id);
    }
  }, [session]);

  useEffect(() => {
    setCurTab(
      dataUser?.role.name === "broker" || dataUser?.role.name === "guest"
        ? "about"
        : "posts",
    );
  }, [dataUser]);

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
      console.log("eeeeeee");
      fetchProfileData();
    }
  }, [idUser]);

  const fetchProfileData = async () => {
    try {
      const dtProfileRes = await getProfile(String(idUser));
      // console.log("render", dtProfileRes);
      const interestTopicRes: any = await createGetAllTopicsRequest(1, 100);
      setDtBrokerProfile(dtProfileRes?.data?.brokerProfile || []);
      setDtUser(dtProfileRes?.data?.user || []);
      setDtUserProfile(dtProfileRes?.data?.userProfile || []);
      setListInterestTopic(interestTopicRes?.data.docs || []);
      setFlCount(dtProfileRes?.data?.followersCount || 0);
      setFolowed(dtProfileRes.data?.followed);
      console.log("count", dtProfileRes?.data?.followersCount);
      console.log("count", flCount);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === t("Posts")) {
      setCurTab("posts");
    } else if (chosenTab === t("Communities")) {
      setCurTab("communities");
    } else if (chosenTab === t("about")) {
      setCurTab("about");
    } else if (chosenTab === t("Wallet")) {
      setCurTab("wallet");
    } else {
      setCurTab("rating");
    }
  };

  const [tabClass, setTabClass] = useState<string>("");

  // useEffect(() => {
  //   const totalTabs = dataUser.role.name === "broker" ? 3 : 2;
  //   if (totalTabs === 2) {
  //     setTabClass(styles["two-tabs"] || "");
  //   } else if (totalTabs === 3) {
  //     setTabClass(styles["three-tabs"] || "");
  //   }
  // }, [dataUser.role.name]);

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
        />
        <div className={`${styles["group-tabs"]} ${tabClass}`}>
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.Posts ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>{t("Posts")}</p>
          </div>
          {(dataUser.role.name === "broker" ||
            dataUser.role.name === "guest") && (
            <div
              className={`${styles["button-tab"]} ${curTab === TabPnum.About ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
              onClick={(e) => onSelectTabHandler(e)}
            >
              <p>{t("About")}</p>
            </div>
          )}
          <div
            className={`${styles["button-tab"]} ${styles["button-tab__communities"]} ${curTab === TabPnum.Communities ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>{t("Communities")}</p>
          </div>
          {dataUser.role.name === "broker" && (
            <div
              className={`${styles["button-tab"]} ${curTab === TabPnum.Rating ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
              onClick={(e) => onSelectTabHandler(e)}
            >
              <p>{t("Rating")}</p>
            </div>
          )}
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.Wallet ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>{t("Wallet")}</p>
          </div>
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
          myPosts={myPosts}
          totalPages={totalPage}
          curPage={page}
          id={String(idUser)}
          take={TAKE}
        />
      )}
      {curTab === TabPnum.Communities && (
        <TabGroupProfile
          isBroker={dataUser.role.name === "broker"}
          // communities={dataMyGroups}
          communityType={
            dataUser.role.name === "broker" ? "owned" : "following"
          }
          // curPage={curPageGroup}
          // allPage={allPageGroup}
          take={TAKE}
          id={Number(idUser)}
        />
      )}
      {dataUser.role.name === "broker" && curTab === TabPnum.Rating && (
        <TabRating brokerData={dataUser} />
      )}
      {curTab === TabPnum.Wallet && <Wallet />}
    </div>
  );
}
export async function getServerSideProps(context: NextPageContext) {
  const { key } = context.query;
  if (!key) {
    return {
      notFound: true, // This triggers the 404 page
    };
  }
  const profileRes = await getProfile(key as string);
  const idUser = profileRes?.data?.user?.id;
  const interestTopic: any = await createGetAllTopicsRequest(1, 100);
  let myPost;
  if (idUser) {
    myPost = await getMyPosts(1, TAKE, "owner", Number(idUser));
  }
  // const brokerId =
  //   profileRes?.data?.user?.role?.name === "broker" ? Number(id) : "";
  // const type = profileRes?.data?.user?.role?.name === "broker" ? "" : "joined";
  // const myGroup = await getMyGroups({
  //   page: 1,
  //   take: TAKE,
  //   type,
  //   brokerId,
  //   search: "",
  //   feeType: "",
  // });
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      dataBrokerProfile: profileRes?.data?.brokerProfile || [],
      dataUserProfile: profileRes?.data?.userProfile || [],
      dataUser: profileRes?.data?.user || [],
      followersCount: profileRes?.data?.followersCount,
      followed: profileRes?.data?.followed,
      ssi: profileRes?.data?.ssi || null,
      idUser: idUser,
      interestTopic: interestTopic?.data.docs || [],
      myPosts: myPost?.data?.docs || null,
      totalPage: myPost?.data?.meta?.totalPage || 1,
      page: myPost?.data?.meta.page || 1,
      userUsername: key || "",
      // dataMyGroups: myGroup?.data?.docs || null,
      // curPageGroup: myGroup?.data?.meta.page || 1,
      // allPageGroup: myGroup?.data?.meta.totalPage || 1,
    },
  };
}
