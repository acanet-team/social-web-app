import React, { useEffect, useRef, useState } from "react";
import SignalCard from "./SignalCard";
import DotWaveLoader from "../DotWaveLoader";
import { getSignalCards } from "@/api/signal";
import styles from "@/styles/modules/signal.module.scss";
import { SignalStationEnum } from "@/types";
import { useTranslations } from "next-intl";
import type { getSignalCardResponse } from "@/api/signal/model";
import { useSession } from "next-auth/react";

export default function SignalSection(props: {
  cards: any[];
  tab: string;
  allPage: number;
  hasNextPage: boolean;
  existedSignalIds: any[];
}) {
  const [cards, setCards] = useState<getSignalCardResponse[]>(props.cards);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<Boolean>(props.hasNextPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [curUser, setCurUser] = useState<number>();
  const existedSignalIdsRef = useRef<any[]>(props.existedSignalIds);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);
  const tSignal = useTranslations("Signal");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setCurUser(session.user?.id);
    }
  }, [session]);

  const fetchCards = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getSignalCards({
        page: props.tab === SignalStationEnum.discover ? "" : page,
        type: props.tab === SignalStationEnum.discover ? "unread" : "read",
        brokerId: "",
        existedSignalIds:
          props.tab === SignalStationEnum.discover
            ? existedSignalIdsRef.current.length === 0
              ? ""
              : JSON.stringify(existedSignalIdsRef.current)
            : "",
      });
      setCards((prev) => [...prev, ...res.data.docs]);
      console.log("client res", res);
      console.log("client cards", cards);
      setHasNextPage(res.data?.meta?.hasNextPage);
      if (props.tab === SignalStationEnum.discover) {
        const newExistedSignalIds = res.data.docs.map((c) => c.id);
        existedSignalIdsRef.current = [
          ...existedSignalIdsRef.current,
          ...newExistedSignalIds,
        ];
        // console.log("existedSignalIds", existedSignalIdsRef.current);
      }
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
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isLoading &&
        hasNextPage
      ) {
        if (props.tab === SignalStationEnum.discover) {
          fetchCards(page);
        } else {
          setPage((page) => page + 1);
        }
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
    if (hasFetchedInitialData && props.tab === SignalStationEnum.discover) {
      existedSignalIdsRef.current = [];
      setCards([]);
      setHasNextPage(true);
      fetchCards(page);
      return;
    }
    if (hasFetchedInitialData && props.tab === SignalStationEnum.history) {
      setCards([]);
      setPage(1);
      fetchCards(1);
      return;
    }
  }, [props.tab]);

  useEffect(() => {
    if (props.tab === SignalStationEnum.history) {
      fetchCards(page);
    }
  }, [page]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
      if (props.tab === SignalStationEnum.history) {
        setCards([]);
      }
    }
  }, []);

  return (
    <div
      className={`card shadow-xss w-100 border-0 mb-5 font-system`}
      style={{ marginTop: "40px" }}
    >
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
                readAt={card.readAt && card.readAt}
                type={card.type}
                isTracking={card.isTracking}
                luckyAmount={card.luckyAmount}
                owner={card.owner}
                expiryAt={card.expiryAt}
                createdAt={card.readAt}
                curUserId={curUser}
                readsCount={card.readsCount}
                signalAccuracy={card.signalAccuracy}
              />
            </div>
          ))}
      </div>
      {!isLoading && cards?.length === 0 && (
        <div className={`${styles["no-signal"]} mb-5 text-center`}>
          {tSignal("no_signal_found")}
        </div>
      )}
      {isLoading && (
        <div className="mb-5">
          <DotWaveLoader />
        </div>
      )}
    </div>
  );
}
