import { fullSearchByType } from "@/api/search";
import type { IFullSearchResponse } from "@/api/search/model";
import DotWaveLoader from "@/components/DotWaveLoader";
import QuickSearchCard from "@/components/search/QuickSearchCard";
import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/header.module.scss";
import { useTranslations } from "next-intl";

export default function SearchFullByType(props: {
  tab: string;
  keyword: string;
}) {
  const { tab, keyword } = props;
  const tSearch = useTranslations("Search");
  const [searchResults, setSearchResults] = useState<IFullSearchResponse>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(false);
  const TAKE = 15;

  const fullSearch = async (page: number, keyword: string) => {
    try {
      setIsLoading(true);
      const res = await fullSearchByType(
        keyword,
        tab === "people" ? "users" : "communities",
        TAKE,
        page,
      );
      setSearchResults((prev) => [...prev, ...res.data.docs]);
      console.log("full search", res.data.docs);

      setTotalPage(res.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firstRender) {
      setSearchResults([]);
      fullSearch(page, keyword);
    }
  }, [tab, keyword]);

  useEffect(() => {
    if (firstRender) {
      fullSearch(1, keyword);
    }
  }, [firstRender]);

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        page < totalPage
      ) {
        setPage((page) => page + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1) {
      fullSearch(page, keyword);
    }
  }, [page]);

  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true);
    }
  }, []);

  return (
    <div className="my-5">
      {!isLoading && searchResults.length === 0 && (
        <div className="mt-5 text-center">{`${tSearch("search_no_result")} ${keyword}`}</div>
      )}
      {isLoading && <DotWaveLoader />}
      {searchResults?.length > 0 &&
        searchResults?.map((data, index) => (
          <div key={index}>
            <QuickSearchCard
              type={tab === "community" ? "community" : "user"}
              isFullSearch={tab === "community" ? true : false}
              data={data}
            />
          </div>
        ))}
    </div>
  );
}
