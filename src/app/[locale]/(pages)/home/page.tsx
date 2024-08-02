import Appfooter from "@/app/components/Appfooter";
import CreatePost from "@/app/components/Createpost";
import NavLink from "@/app/components/NavLink";
import Load from "@/app/components/WaveLoader";
import styles from "@/styles/modules/home.module.scss";
import Layout from "../layout";
import { FetchBrokers } from "@/app/components/newsfeed/FetchBrokers";
import { FetchPosts } from "@/app/components/newsfeed/FetchPosts";
import React from "react";
import ForYou from "@/app/components/newsfeed/ForYou";
import Suggestion from "@/app/components/newsfeed/Suggestion";

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  console.log(searchParams);
  const renderPosts = () => {
    if (searchParams.tab === "suggestion") {
      return <Suggestion />;
    } else if (searchParams.tab === "you") {
      return <ForYou />;
    }
    return (
      <FetchPosts postIdParams={searchParams?.comments?.toString() || ""} />
    );
  };

  return (
    <Layout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className={styles["home-tabs"]}>
                  {/* Tab display */}
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=you"
                  >
                    For you
                  </NavLink>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=suggestion"
                  >
                    Suggestion
                  </NavLink>
                </div>
                <FetchBrokers />
                <CreatePost />
                {renderPosts()}
                {/* <ForYou />
                <Suggestion />
                <FetchPosts
                  postIdParams={searchParams.comments?.toString() || ""}
                /> */}

                <Load />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                {/* <Contacts /> */}
                {/* <Group /> */}
                {/* <Events />
                <Profilephoto /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Popupchat /> */}
      <Appfooter />
    </Layout>
  );
};

export default React.memo(Home);
