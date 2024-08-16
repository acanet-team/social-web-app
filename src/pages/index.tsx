import { getPosts, getTopBrokers } from "@/api/newsfeed";
import Contacts from "@/app/components/Contacts";
import CreatePost from "@/app/components/newsfeed/Createpost";
import FetchBrokers from "@/app/components/newsfeed/FetchBrokers";
import Posts from "@/app/components/newsfeed/Posts";
import RootLayout from "@/layout/root";
import styles from "@/styles/modules/home.module.scss";
import { TabEnum } from "@/types/enum";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const TAKE = 10;

const Home = ({
  posts,
  totalPage,
  page,
  topBrokers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [curTab, setCurTab] = useState<string>("suggestion");
  const { data: session } = useSession() as any;

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === "For you") {
      setCurTab("for_you");
    } else {
      setCurTab("suggestion");
    }
  };
  return (
    <RootLayout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <FetchBrokers brokers={topBrokers} />
                <div className={`${styles["home-tabs"]} bg-light`}>
                  <div
                    className={`${styles["button-tab"]} ${curTab === TabEnum.ForYou ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                    onClick={(e) => onSelectTabHandler(e)}
                  >
                    For you
                  </div>
                  <div
                    className={`${styles["button-tab"]} ${curTab === TabEnum.Suggestion ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                    onClick={(e) => onSelectTabHandler(e)}
                  >
                    Suggestion
                  </div>
                </div>
                <CreatePost userSession={session} />
                <Posts
                  posts={posts}
                  feedType={curTab}
                  take={TAKE}
                  allPage={totalPage}
                  curPage={page}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                <Contacts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default React.memo(Home);

export async function getServerSideProps(context: NextPageContext) {
  const postRes = await getPosts(1, TAKE, "suggestion");
  const brokerRes = await getTopBrokers(1, 20);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      posts: postRes?.data?.docs || [],
      totalPage: postRes?.data?.meta?.totalPage,
      page: postRes?.data?.meta.page,
      topBrokers: brokerRes?.data.docs || [],
    },
  };
}
