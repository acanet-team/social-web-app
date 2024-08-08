"use client";
import { subscribeTopicsRequest } from "@/api/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { createGetAllTopicsRequest } from "@/api/user";
import styles from "@/styles/modules/interest.module.scss";
import Link from "next/link";
import { useTranslations } from "next-intl";
import DotWaveLoader from "../DotWaveLoader";
import Pagetitle from "../Pagetitle";

interface Option {
  id: string;
  topicName: string;
}

export default function Interests(props: { onNextHandler: () => void }) {
  const list = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const TAKE = 20;
  const t = useTranslations("Interest");

  const onSelectInterestHandler = () => {
    if (selectedOptions.length === 0) {
      return setError("Please choose at least 1 interest topic.");
    }
    try {
      subscribeTopicsRequest({ interestTopicIds: selectedOptions });
      router.push("/brokers");
    } catch (err) {
      console.log(err);
    }
  };

  const manipulateClasses = (e: any, addedClass: any, removedClass: any) => {
    e.target.classList.remove(removedClass);
    e.target.classList.add(addedClass);
  };

  const toggleSelection = (e: any, optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions((prevState) =>
        prevState.filter((id) => id !== optionId),
      );
      manipulateClasses(e, styles["btn-unselected"], styles["btn-selected"]);
    } else {
      setSelectedOptions((prevState) => [...prevState, optionId]);
      manipulateClasses(e, styles["btn-selected"], styles["btn-unselected"]);
    }
  };

  const fetchTopics = async (page: number, TAKE: number) => {
    try {
      setIsLoading(true);
      const response: any = await createGetAllTopicsRequest(page, TAKE);
      // console.log(response);
      setOptions((prevState) =>
        response.data.docs
          ? [...prevState, ...response.data.docs]
          : [...prevState, ...response.data.data],
      );
      setTotalPage(response.data.meta.totalPage);
      return response.data;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Inifite scrolling
  const onScrollHandler = () => {
    if (list.current) {
      const { scrollTop, scrollHeight, clientHeight } = list.current;
      if (scrollTop + clientHeight === scrollHeight && !isLoading) {
        setPage((prevState) => prevState + 1);
      }
    }
  };

  useEffect(() => {
    const currentList = list.current;
    if (currentList && page < totalPage) {
      currentList.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (currentList) {
        currentList.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage]);

  useEffect(() => {
    fetchTopics(page, TAKE);
  }, [page, TAKE]);

  return (
    <>
      <div id={styles.interest} className="right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="onboard-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                {/* <div className="card-body p-4 w-100 bg-current border-0 rounded-3"> */}
                {/* <Link href="/defaultsettings" className="d-inline-block mt-2">
                    <i className="ti-arrow-left font-sm text-white" />
                  </Link>
                  <h4 className="fs-1 text-white fw-800">
                    {t("interest_title")}
                  </h4>
                  <p>{t("interest_description")}</p> */}
                <Pagetitle
                  title={t("interest_title")}
                  intro={t("interest_description")}
                  isSearch={false}
                />
                {/* </div> */}

                <div
                  ref={list}
                  id={styles["interest-container"]}
                  className="interest-options card-body p-lg-5 p-4 w-100 border-0 d-flex flex-wrap justify-content-center gap-3 mb-5"
                >
                  {options?.length > 0 &&
                    options.map((option) => (
                      <button
                        key={option.id}
                        onClick={(e) => toggleSelection(e, option.id)}
                        className="btn"
                      >
                        {option.topicName}
                      </button>
                    ))}
                </div>

                {error && (
                  <div className="mx-auto dark-error-text">{error}</div>
                )}
                {isLoading && <DotWaveLoader />}
                <button
                  type="submit"
                  className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-5 mx-auto"
                  onClick={onSelectInterestHandler}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
