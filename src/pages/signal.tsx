import { SignalStationEnum } from "@/types";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/signal.module.scss";
import SignalCard from "@/components/signal/SignalCard";

const Signal = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [curTab, setCurTab] = useState<string>("discover");
  const tSignal = useTranslations("Signal");
  // const [feedPosts, setPosts] = useState<IPost[]>(posts);
  // const { data: session } = useSession() as any;
  // const tPost = useTranslations("CreatePost");
  // const [postType, setPostType] = useState<"post" | "signal">("post");

  // const postTypeChangeHandler = (event: SelectChangeEvent) => {
  //   setPostType(event.target.value as "post" | "signal");
  // };

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === tSignal("discover_tab")) {
      setCurTab("discover");
    } else {
      setCurTab("history");
    }
  };
  return (
    <div id={styles["signal-station"]} className="nunito-font">
      <h1 className="fs-2 fw-bolder mb-3 mt-1">
        {tSignal("signal_station_title")}
      </h1>
      <div className="card shadow-xss w-100 border-0">
        <div className={`${styles["signal-tabs"]} card-body`}>
          <div
            className={`${styles["button-tab"]} ${curTab === SignalStationEnum.discover ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            {tSignal("discover_tab")}
          </div>
          <div
            className={`${styles["button-tab"]} ${curTab === SignalStationEnum.history ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            {tSignal("history_tab")}
          </div>
        </div>
      </div>

      {/* <CommunitySection
        isBroker={isBroker}
        communities={communityPosts}
        communityType={curTab}
        take={TAKE}
        allPage={totalPage}
        curPage={page}
      /> */}
      <div className="card shadow-xss w-100 border-0 p-4 mt-4">
        <SignalCard />
      </div>
    </div>
  );
};

export default Signal;

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
