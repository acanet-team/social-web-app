import { SignalStationEnum } from "@/types";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/signal.module.scss";
import SignalSection from "@/components/signal/SignalSection";
import type { getSignalCardResponse } from "@/api/signal/model";
import { getSignalCards } from "@/api/signal";

const Signal = ({
  cards,
  totalPage,
  hasNextPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [curTab, setCurTab] = useState<string>("discover");
  const tSignal = useTranslations("Signal");
  const existedSignalIds = cards.map((c) => c.id);
  console.log("existed", existedSignalIds);

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

      <SignalSection
        cards={cards}
        tab={curTab}
        allPage={totalPage}
        hasNextPage={hasNextPage}
        existedSignalIds={existedSignalIds}
      />
    </div>
  );
};

export default Signal;

export async function getServerSideProps(context: NextPageContext) {
  // Get 9 front cards from server
  const res = await getSignalCards({
    page: "",
    type: "unread",
    brokerId: "",
    existedSignalIds: "",
  });
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      cards: res?.data?.docs || [],
      totalPage: res?.data?.meta?.totalPage || 1,
      hasNextPage: res?.data?.meta?.hasNextPage || true,
    },
  };
}
