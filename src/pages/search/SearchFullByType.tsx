import { fullSearchByType } from "@/api/search";
import type { IFullSearchResponse } from "@/api/search/model";
import DotWaveLoader from "@/components/DotWaveLoader";
import QuickSearchCard from "@/components/search/QuickSearchCard";
import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/header.module.scss";

export default function SearchFullByType(props: {
  tab: string;
  keyword: string;
}) {
  const { tab, keyword } = props;
  const [searchResults, setSearchResults] = useState<IFullSearchResponse>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fullSearch = async (keyword: string) => {
    try {
      // setIsLoading(true);
      // const res = await fullSearchByType(
      //   keyword,
      //   tab === "people" ? "user" : "community"
      // );
      // setSearchResults(res.data.docs);
      // setTotalPage(res.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Call api & send keyword to fetch search results
    fullSearch(keyword);
  }, [tab, keyword]);

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
      fullSearch(keyword);
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

  return (
    <div className="mt-5">
      {/* {!isLoading && searchResults.length === 0 && (
        <div className="mt-5 text-center">No posts found.</div>
      )} */}
      {isLoading && <DotWaveLoader />}
      {searchResults?.length > 0 &&
        searchResults?.map((data, index) => (
          <div key={index}>
            <QuickSearchCard
              type="user"
              isFullSearch={tab === "community" ? true : false}
              data={data}
            />
          </div>
        ))}
    </div>
  );
}
