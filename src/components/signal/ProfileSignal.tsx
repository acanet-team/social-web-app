import React, { useCallback, useEffect, useState } from "react";
import SignalCard from "./SignalCard";
import DotWaveLoader from "../DotWaveLoader";
import styles from "@/styles/modules/signal.module.scss";
import { getSignalCards } from "@/api/signal";
import { useTranslations } from "next-intl";
import type { cardData } from "@/api/signal/model";

export default function ProfileSignal(props: { brokerId: number }) {
  const tSignal = useTranslations("Signal");
  const [cards, setCards] = useState<cardData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await getSignalCards({
        page: "",
        type: "unread",
        brokerId: props.brokerId,
        existedSignalIds: "",
      });
      setCards((prev) => [...prev, ...res.data.docs] as cardData[]);
      console.log("cards", res.data.docs);
      console.log("cards state", cards);

      // setTotalPage(res.data?.meta?.totalPage);
      setHasNextPage(res.data?.meta?.hasNextPage);
      setPage((page) => page + 1);
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
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
      fetchCards();
    }
  }, []);

  // useEffect(() => {
  //   fetchCards();
  // }, [hasNextPage]);

  return (
    <div className={`card shadow-xss w-100 border-0 mt-4 mb-5 nunito-font`}>
      {cards?.length === 0 && (
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
