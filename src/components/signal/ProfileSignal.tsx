import React, { useCallback, useEffect, useState } from "react";
import SignalCard from "./SignalCard";
import DotWaveLoader from "../DotWaveLoader";
import styles from "@/styles/modules/signal.module.scss";
import { getSignalCards } from "@/api/signal";
import { useTranslations } from "next-intl";
import type { getSignalCardResponse } from "@/api/signal/model";

export default function ProfileSignal(props: {
  brokerId: number;
  userId: number | undefined;
}) {
  const tSignal = useTranslations("Signal");
  const [cards, setCards] = useState<getSignalCardResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);

  const fetchCards = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getSignalCards({
        page: page,
        type: "",
        brokerId: props.brokerId,
        existedSignalIds: "",
      });
      setCards(
        (prev) => [...prev, ...res.data.docs] as getSignalCardResponse[],
      );
      console.log("cards", res.data.docs);
      setHasNextPage(res.data?.meta?.hasNextPage);
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
        setPage((page) => page + 1);
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
      fetchCards(1);
    }
  }, [hasFetchedInitialData]);

  useEffect(() => {
    if (page > 1) {
      fetchCards(page);
    }
  }, [page]);

  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  return (
    <div className={`card shadow-xss w-100 border-0 mt-4 mb-5 nunito-font`}>
      {!isLoading && cards?.length === 0 && (
        <div className="mt-5 text-center">{tSignal("no_signal_found")}</div>
      )}
      <div className={styles["card_container"]}>
        {cards?.length > 0 &&
          cards.map((card) => (
            <div key={card.id}>
              <SignalCard
                id={card.id}
                signalPair={card.signalPair}
                entry={card.entry}
                target={card.target}
                stop={card.stop}
                description={card.description}
                expiryAt={card.expiryAt}
                readAt={card.readAt && card.readAt}
                type={card.type}
                owner={card.owner}
                createdAt={card.readAt}
                brokerId={props.brokerId} // for signal section in profile only (this id means the current broker profile)
                curUserId={props.userId}
                readsCount={card.readsCount}
              />
            </div>
          ))}
      </div>
      {isLoading && <DotWaveLoader />}
    </div>
  );
}
