// "use client";

// import React, { useEffect, useState } from "react";

// import Appfooter from "@/app/components/Appfooter";
// import Createpost from "@/app/components/Createpost";
// import Memberslider from "@/app/components/Memberslider";
// import Friendsilder from "@/app/components/Friendsilder";
// import FetchBroker from "@/app/components/newsfeed/TopBrokers";
// import Postview from "@/app/components/newsfeed/Postview";
// import styles from "@/styles/modules/home.module.scss";
// import NavLink from "@/app/components/NavLink";
// import Layout from "../layout";
// import Link from "next/link";
// import Popupchat from "../../../components/Popupchat";
// import Contacts from "@/app/components/Contacts";

// export default function Home() {
//   const [posts, setPosts] = useState<Object[]>([]);
//   const [isLoading, setIsLoading] = useState<Boolean>(false);
//   const onClickForYouHandler = () => {
//     console.log("fetching for-you feed");
//     // setPosts()
//   };
//   const onClickSuggestionHandler = () => {
//     console.log("fetching suggestion feed");
//     // setPosts()
//   };

//   useEffect(() => {
//     // Fetch for-you feed
//     // setPosts()
//   }, []);
//   return (
//     <Layout>
//       <div className="main-content right-chat-active" id={styles.home}>
//         <div className="middle-sidebar-bottom">
//           <div className="middle-sidebar-left">
//             <div className="row feed-body">
//               <div className="col-xl-8 col-xxl-9 col-lg-8">
//                 <div className={styles["home-tabs"]}>
//                   <NavLink
//                     className={`${styles["tab-active"]} d-flex justify-content-center`}
//                     href="/home?tab=you"
//                     onClick={onClickForYouHandler}
//                   >
//                     For you
//                   </NavLink>
//                   <NavLink
//                     className={`${styles["tab-active"]} d-flex justify-content-center`}
//                     href="/home?tab=sugesstion"
//                     onClick={onClickSuggestionHandler}
//                   >
//                     Suggestion
//                   </NavLink>
//                 </div>
//                 <FetchBroker />
//                 <Createpost />
//                 {/* Generate posts */}
//                 <Postview
//                   id="32"
//                   postvideo=""
//                   postimage="post.png"
//                   avater="user.png"
//                   user="Surfiya Zakir"
//                   time="22 min ago"
//                   des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
//                 />
//                 <Postview
//                   id="31"
//                   postvideo=""
//                   postimage="post.png"
//                   avater="user.png"
//                   user="David Goria"
//                   time="22 min ago"
//                   des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
//                 />
//                 <Postview
//                   id="33"
//                   postvideo=""
//                   postimage="post.png"
//                   avater="user.png"
//                   user="Anthony Daugloi"
//                   time="2 hour ago"
//                   des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
//                 />
//                 <Memberslider />
//                 <Postview
//                   id="35"
//                   postvideo=""
//                   postimage="post.png"
//                   avater="user.png"
//                   user="Victor Exrixon"
//                   time="3 hour ago"
//                   des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
//                 />
//                 <Friendsilder />
//                 <Postview
//                   id="36"
//                   postvideo=""
//                   postimage="post.png"
//                   avater="user.png"
//                   user="Victor Exrixon"
//                   time="12 hour ago"
//                   des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
//                 />
//                 {/* <Load /> */}
//               </div>
//               <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
//                 <Contacts />
//                 {/* <Group /> */}
//                 {/* <Events />
//                 <Profilephoto /> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* <Popupchat /> */}
//       <Appfooter />
//     </Layout>
//   );
// }

import Appfooter from "@/app/components/Appfooter";
import CreatePost from "@/app/components/Createpost";
import NavLink from "@/app/components/NavLink";
import FetchPosts from "@/app/components/newsfeed/FetchPosts";
import FetchBroker from "@/app/components/newsfeed/FetchBrokers";
import Load from "@/app/components/WaveLoader";
import styles from "@/styles/modules/home.module.scss";
import Layout from "../layout";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // const onClickForYouHandler = () => {
  //   console.log("fetching for-you feed");
  //   // setPosts()
  // };

  // const onClickSuggestionHandler = () => {
  //   console.log("fetching suggestion feed");
  //   // setPosts()
  // };

  // const onClickTabHandler = (e: any) => {
  //   console.log(e.target);
  // };

  return (
    <Layout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                {/* <FeedTabs onClickTab={onClickTabHandler} /> */}
                <div className={styles["home-tabs"]}>
                  {/* <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=you"
                    onClick={onClickForYouHandler}
                  >
                    For you
                  </NavLink>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=sugesstion"
                    onClick={onClickSuggestionHandler}
                  >
                    Suggestion
                  </NavLink> */}

                  {/* <form action={e => onClickTabHandler(e)}>
                    <Link href="/home?tab=you">For you</Link>
                    <Link href="/home?tab=sugesstion">Suggestion</Link>
                  </form> */}
                </div>
                {/* <FetchBroker /> */}
                <CreatePost />

                {/* Generate posts */}
                <FetchPosts
                  postIdParams={searchParams.comments?.toString() || ""}
                />

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
}
