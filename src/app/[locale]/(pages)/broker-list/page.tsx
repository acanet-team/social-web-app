"use client";
import React, { Fragment, useEffect, useState } from "react";
import Pagetitle from "@/app/components/Pagetitle";
import type { AxiosError } from "axios";
import { createGetBrokersRequest } from "@/api/user";
import styles from "@/styles/modules/brokerList.module.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function BrokerList(props: {
  params: { locale: string };
  brokers: any[];
}) {
  const t = useTranslations("BrokerList");
  const [brokerList, setBrokerList] = useState<[]>([]);
  const [pagination, setPagination] = useState<number>(1);
  const [curPage, setCurPage] = useState<number>(1);
  const BROKERS_PER_PAGE = 20;

  const fetchBrokerList = async () => {
    try {
      const response: any = await createGetBrokersRequest(
        curPage,
        BROKERS_PER_PAGE,
      );
      console.log(response);
      // setBrokerList(response.data.data);
    } catch (err) {
      const errors = err as AxiosError;
      console.log(errors);
    }
  };

  useEffect(() => {
    fetchBrokerList();
  }, [curPage, BROKERS_PER_PAGE]);

  // useEffect(() => {
  //   createGetBrokersRequest(curPage, BROKERS_PER_PAGE).then((res: any) => {
  //     console.log(res);
  //     setBrokerList(res.data.data);
  //   });
  // }, [curPage, BROKERS_PER_PAGE]);

  const onChangePageHandler = (page: number) => {
    console.log(page);
    setCurPage(page);
  };

  // const onFollowBrokerHandler = (brokerId) => {
  //   console.log("follow a broker");
  // };
  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <Pagetitle
                  title={t("broker_title")}
                  intro={t("broker_description")}
                />

                <div className="row ps-2 pe-2" id={styles["all-brokers"]}>
                  {/* {brokerList &&
                    brokerList.length > 0 &&
                    brokerList.map((b) => (
                      <div
                        key={b.brokerProfileId}
                        className="col-md-3 col-sm-4 pe-2 ps-2"
                      >
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                          <div
                            className={`${styles["broker-profile"]} card-body d-block w-100`}
                          >
                            <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative z-index-1">
                              <Image
                                src="https://via.placeholder.com/300x300.png"
                                width={211}
                                height={211}
                                alt="avatar"
                                className="shadow-sm rounded-3 w-100"
                              />
                            </figure>
                            <div className="ms-1">
                              <h4 className="fw-700 mt-3 mb-0">
                                {b.firstname + b.lastname}
                              </h4>
                              <div className={`${styles["broker-skill"]} my-1`}>
                                <FontAwesomeIcon
                                  icon={faSuitcase}
                                  className={`${styles["broker-icon"]} fa-thin fa-suitcase me-2`}
                                ></FontAwesomeIcon>
                                {b.skills[0]}
                              </div>
                            </div> */}
                  {/* Broker's data */}
                  {/* <div className={styles["profile-data"]}>
                              <div className="row d-flex w-100 m-0">
                                <div className="col p-0">
                                  <div>Followers</div>
                                  <div className={styles["broker-stats"]}>
                                    {(b.followersCount / 1000).toFixed(1)}k
                                  </div>
                                </div>
                                <div className="col p-0">
                                  <div>Enrolled</div>
                                  <div className={styles["broker-stats"]}>
                                    {(b.coursesEnrolledCount / 1000).toFixed(1)}
                                  </div>
                                </div>
                              </div>

                              <div className="row d-flex w-100 mt-2 m-0">
                                <div className="col p-0">
                                  <div>Rating</div>
                                  {Array.from(
                                    { length: b.rating },
                                    (_, index) => (
                                      <FontAwesomeIcon
                                        key={index}
                                        icon={faStar}
                                        className={`${styles["broker-icon"]} fa-solid fa-star me-2`}
                                      ></FontAwesomeIcon>
                                    ),
                                  )}
                                  {Array.from(
                                    { length: 5 - b.rating },
                                    (_, index) => (
                                      <FontAwesomeIcon
                                        key={index}
                                        icon={faStar}
                                        className={`${styles["broker-icon"]} fa-regular fa-star me-2`}
                                      ></FontAwesomeIcon>
                                    ),
                                  )}
                                </div>
                                <div className="col p-0">
                                  <div>Ranking</div>
                                  <div>rank</div>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`${styles["follow-btn"]} main-btn bg-current text-center text-white fw-500 w-100 border-0 d-inline-block`}
                              onClick={() =>
                                onFollowBrokerHandler(b.brokerProfileId)
                              }
                            >
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                    ))} */}
                </div>

                {/* Pagination */}
                <Stack spacing={2}>
                  <Pagination
                    count={pagination}
                    variant="outlined"
                    color="secondary"
                    // onClick={(e) =>
                    //   onChangePageHandler(
                    //     parseInt(e.currentTarget.textContent || "1", 10),
                    //   )
                    // }
                    sx={{
                      ".MuiPagination-ul": { "justify-content": "center" },
                    }}
                  />
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
