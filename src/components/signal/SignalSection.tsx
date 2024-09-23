import React, { useEffect, useState } from "react";
import SignalCard from "./SignalCard";
import DotWaveLoader from "../DotWaveLoader";
import { getSignalCards } from "@/api/signal";
import styles from "@/styles/modules/signal.module.scss";
import { SignalStationEnum } from "@/types";
import { useTranslations } from "next-intl";

export default function SignalSection(props: {
  cards: any[];
  tab: string;
  allPage: number;
  hasNextPage: boolean;
  existedSignalIds: any[];
}) {
  const [cards, setCards] = useState<any[]>(props.cards);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [hasNextPage, setHasNextPage] = useState<Boolean>(props.hasNextPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [existedSignalIds, setExistedSignalIds] = useState<any[]>(
    props.existedSignalIds,
  );
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);
  const tSignal = useTranslations("Signal");

  console.log("bbb", existedSignalIds);
  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await getSignalCards({
        page: 1,
        type: props.tab === SignalStationEnum.discover ? "unread" : "read",
        brokerId: "",
        existedSignalIds:
          existedSignalIds.length === 0 ? "" : JSON.stringify(existedSignalIds),
      });
      console.log("res", res);
      setCards((prev) => [...prev, ...res.data.docs]);
      console.log("cards", cards);
      // setTotalPage(res.data?.meta?.totalPage);
      setHasNextPage(res.data?.meta?.hasNextPage);
      const newExistedSignalIds = res.data.docs.map((c) => c.id);
      setExistedSignalIds((prev) => [...prev, ...newExistedSignalIds]);
      console.log("existedSignalIds", newExistedSignalIds);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite scroll
  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        hasNextPage
      ) {
        fetchCards();
      }
    }
  };

  useEffect(() => {
    if (document.documentElement && hasNextPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [hasNextPage, isLoading]);

  useEffect(() => {
    if (hasFetchedInitialData) {
      // setTotalPage(2);
      setHasNextPage(true);
      setCards([]);
      fetchCards();
      console.log("aaa");
    }
  }, [props.tab]);

  // useEffect(() => {
  //   fetchCards();
  // }, [hasNextPage]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  return (
    <div className={`card shadow-xss w-100 border-0 mt-4 nunito-font`}>
      {!isLoading && cards?.length === 0 && (
        <div className="mt-4 text-center">{tSignal("no_signal_found")}</div>
      )}
      <div className={styles["card_container"]}>
        {cards?.length > 0 &&
          cards.map((card) => (
            <div key={card.id}>
              <SignalCard cardId={card.id} />
            </div>
          ))}
      </div>
      {isLoading && <DotWaveLoader />}
    </div>
  );
}
