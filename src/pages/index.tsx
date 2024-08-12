import "@/styles/global.scss";
import Appfooter from "@/app/components/Appfooter";
import NavLink from "@/app/components/NavLink";
import styles from "@/styles/modules/home.module.scss";
import { FetchBrokers } from "@/app/components/newsfeed/FetchBrokers";
import { ForYou } from "@/app/components/newsfeed/ForYou";
import React from "react";
import Contacts from "@/app/components/Contacts";
import { Suggestion } from "@/app/components/newsfeed/Suggestion";
import CreatePost from "@/app/components/newsfeed/Createpost";
import type { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import RootLayout from "@/layout/root";
import { useAccessTokenStore } from "@/store/accessToken";
import type { getServerSideProps } from "next/dist/build/templates/pages";

const Home = () => {
  return (
    <RootLayout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className={styles["home-tabs"]}>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=for_you"
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
                {/* {searchParams.tab === "suggestion" ? (
                  <Suggestion
                    tab={"suggestion"}
                    postIdParams={searchParams?.comments?.toString() || ""}
                  />
                ) : (
                  <ForYou
                    tab={"for_you"}
                    postIdParams={searchParams?.comments?.toString() || ""}
                  />
                )} */}
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

// export async function getServerSideProps(context: NextPageContext) {
//   // const accessToken = useAccessTokenStore.getState().accessToken;
//   // if (~accessToken) {
//   //   return {
//   //     redirect: {
//   //       destination: "/login",
//   //       permanent: false, // Nếu true, redirect sẽ được cache
//   //     },
//   //   };
//   // }
//   const res = await fetch("https://api.github.com/repos/vercel/next.js");
//   const repo = await res.json();

//   // Pass data to the page via props
//   return {
//     props: {
//       repo,
//       messages: (await import(`@/locales/${context.locale}.json`)).default,
//     },
//   };
// }
