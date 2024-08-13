import { getPosts } from "@/api/newsfeed";
import Contacts from "@/app/components/Contacts";
import NavLink from "@/app/components/NavLink";
import CreatePost from "@/app/components/newsfeed/Createpost";
import { FetchBrokers } from "@/app/components/newsfeed/FetchBrokers";
import { ForYou } from "@/app/components/newsfeed/ForYou";
import { Suggestion } from "@/app/components/newsfeed/Suggestion";
import RootLayout from "@/layout/root";
import "@/styles/global.scss";
import styles from "@/styles/modules/home.module.scss";
import { TabEnum } from "@/types/enum";
import type { NextPageContext } from "next";
import React from "react";

const Home = () => {
  const [tab, setTab] = React.useState<string>(TabEnum.ForYou);
  // const [postIdParams, setPostIdParams] = React.useState<string>("");
  // const [comments, setComments] = React.useState<string>("");
  // const [newFeeds, setNewFeeds] = React.useState<any[]>([]);
  // const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  // const [page, setPage] = React.useState<number>(1);
  // const [take, setTake] = React.useState<number>(20);
  // const [totalPage, setTotalPage] = React.useState<number>(1);

  // const fetchNewsFeed = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response: any = await getPosts(page, take, tab);
  //     console.log("aaaa", response);

  //     if (response && response.data.docs.length > 0) {
  //       setNewFeeds((prev) => [...prev, ...response.data.docs]);
  //       setTotalPage(response.data.meta.totalPage);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // React.useEffect(() => {
  //   fetchNewsFeed();
  // }, [page, tab]);
  return (
    <RootLayout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <FetchBrokers />
                <div className={styles["home-tabs"]}>
                  <div
                    className={`${styles["button-tab"]} ${tab === TabEnum.ForYou ? styles["tab-active"] : ""} d-flex justify-content-center`}
                    onClick={() => {
                      setTab(TabEnum.ForYou);
                    }}>
                    For you
                  </div>
                  <div
                    className={`${styles["button-tab"]} ${tab === TabEnum.Suggestion ? styles["tab-active"] : ""} d-flex justify-content-center`}
                    onClick={() => {
                      setTab(TabEnum.Suggestion);
                    }}>
                    Suggestion
                  </div>
                </div>
                <CreatePost />
                {tab === "suggestion" ? (
                  <Suggestion tab={"suggestion"} postIdParams={""} />
                ) : (
                  <ForYou tab={"for_you"} postIdParams={""} />
                )}
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
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
