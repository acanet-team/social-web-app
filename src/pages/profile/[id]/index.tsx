import React, { useEffect, useState } from "react";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import styles from "@/styles/modules/profile.module.scss";
import { TabPnum } from "@/types/enum";
import { getMyGroups, getMyPosts, getProfile } from "@/api/profile";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { createGetAllTopicsRequest } from "@/api/onboard";
import TabPostProfile from "@/app/components/profile/TabPostProfile";
import TabGroupProfile from "@/app/components/profile/TabGroupProfile";
import TabAbout from "@/app/components/profile/TabAbout";
import Banner from "@/app/components/profile/Banner";

const TAKE = 10;

export default function Profile({
  dataBrokerProfile,
  dataUserProfile,
  dataUser,
  followersCount,
  idParam,
  interestTopic,
  myPosts,
  totalPage,
  page,
  dataMyGroups,
  curPageGroup,
  allPageGroup,
  ssi,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const t = useTranslations("MyProfile");
  const [dtBrokerProfile, setDtBrokerProfile] = useState(dataBrokerProfile);
  const [dtUser, setDtUser] = useState(dataUser);
  const [dtUserProfile, setDtUserProfile] = useState(dataUserProfile);
  const [listInterestTopic, setListInterestTopic] = useState(interestTopic);
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(false);
  const [aboutVisited, setAboutVisited] = useState(false);
  const [curTab, setCurTab] = useState<string>(
    dataUser?.role.name === "broker" ? "about" : "posts",
  );

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

  useEffect(() => {
    if (curTab === "about" && aboutVisited) {
      fetchProfileData();
    }
  }, [curTab]);
  useEffect(() => {
    fetchProfileData();
  }, [idParam]);

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [curTab]);

  useEffect(() => {
    if (!aboutVisited) {
      setAboutVisited(true);
    }
  }, [aboutVisited]);

  const fetchProfileData = async () => {
    try {
      const dtProfileRes = await getProfile(idParam as string);
      const interestTopicRes: any = await createGetAllTopicsRequest(1, 100);
      setDtBrokerProfile(dtProfileRes?.data?.brokerProfile || []);
      setDtUser(dtProfileRes?.data?.user || []);
      setDtUserProfile(dtProfileRes?.data?.userProfile || []);
      setListInterestTopic(interestTopicRes?.data.docs || []);
      console.log(
        "Data refetched successfully!",
        dtProfileRes?.data?.brokerProfile,
      );
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

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
    <>
      <div
        className="card"
        style={{
          background: "#fff",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          borderRadius: "5px",
        }}
      >
        <Banner
          role={role}
          dataUser={dtUser}
          idParam={idParam}
          dataUserProfile={dtUserProfile}
          followersCount={followersCount}
        />
        <div className={`${styles["group-tabs"]}`}>
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.Posts ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>{t("Posts")}</p>
          </div>
          {dataUser.role.name === "broker" && (
            <div
              className={`${styles["button-tab"]} ${curTab === TabPnum.About ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
              onClick={(e) => onSelectTabHandler(e)}
            >
              <p>{t("About")}</p>
            </div>
          )}
          <div
            className={`${styles["button-tab"]} ${curTab === TabPnum.Communities ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            <p>{t("Communities")}</p>
          </div>
        </div>
      </div>
      {curTab === TabPnum.About && (
        <TabAbout
          ssi={ssi}
          dataBrokerProfile={dtBrokerProfile}
          dataUser={dtUser}
          interestTopic={listInterestTopic}
          idParam={idParam}
        />
      )}
      {curTab === TabPnum.Posts && (
        <TabPostProfile
          myPosts={myPosts}
          totalPages={totalPage}
          curPage={page}
          id={idParam as string}
          take={TAKE}
        />
      )}
      {curTab === TabPnum.Communities && (
        <TabGroupProfile
          isBroker={dataUser.role.name === "broker"}
          communities={dataMyGroups}
          communityType={
            dataUser.role.name === "broker" ? "owned" : "following"
          }
          curPage={curPageGroup}
          allPage={allPageGroup}
          take={TAKE}
          id={Number(idParam)}
        />
      )}
    </>
  );
}
export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
  console.log("user id", id);
  const profileRes = await getProfile(id as string);
  console.log("profile res", profileRes);
  const interestTopic: any = await createGetAllTopicsRequest(1, 100);
  const myPost = await getMyPosts(1, TAKE, "owner", Number(id));
  const brokerId = profileRes?.data?.user?.role ? Number(id) : "";
  const myGroup = await getMyGroups({
    page: 1,
    take: TAKE,
    type: "joined",
    brokerId,
    search: "",
    feeType: "",
  });
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      dataBrokerProfile: profileRes?.data?.brokerProfile || [],
      dataUserProfile: profileRes?.data?.userProfile || [],
      dataUser: profileRes?.data?.user || [],
      followersCount: profileRes?.data?.followersCount,
      ssi: profileRes?.data?.ssi || null,
      idParam: id,
      interestTopic: interestTopic?.data.docs || [],
      myPosts: myPost?.data?.docs || [],
      totalPage: myPost?.data?.meta?.totalPage,
      page: myPost?.data?.meta.page,
      dataMyGroups: myGroup?.data?.docs || [],
      curPageGroup: myGroup?.data?.meta.page || 1,
      allPageGroup: myGroup?.data?.meta.totalPage || 1,
    },
  };
}
