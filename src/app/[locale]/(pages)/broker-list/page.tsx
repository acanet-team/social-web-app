'use client';
import React, { Fragment, useEffect, useState } from 'react';
import Pagetitle from '@/app/components/Pagetitle';
import type { AxiosError } from 'axios';
import { createGetBrokersRequest } from '@/api/user';
import styles from '@/styles/modules/brokerList.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

// export async function generateMetadata(props: { params: { locale: string } }) {
//   const t = await getTranslations({
//     locale: props.params.locale,
//     namespace: 'BrokerList',
//   });

//   return {
//     title: t('broker_title'),
//     description: t('broker_description'),
//   };
// }

const memberList = [
  {
    imageUrl: 'user.png',
    name: 'Victor Exrixon ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Surfiya Zakir ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Goria Coast ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Hurin Seary ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Victor Exrixon ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Surfiya Zakir ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Goria Coast ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Hurin Seary ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Surfiya Zakir ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Goria Coast ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Hurin Seary ',
    user: '@macale343',
  },
  {
    imageUrl: 'user.png',
    name: 'Aliqa Macale ',
    user: '@macale343',
  },
];

export default function BrokerList(props: { params: { locale: string } }) {
  const t = useTranslations('BrokerList');
  const [brokerList, setBrokerList] = useState([]);
  const [pagination, setPagination] = useState<number>(1);
  const [curPage, setCurPage] = useState<number>(1);
  const BROKERS_PER_PAGE = 20;

  useEffect(() => {
    try {
      async function fetchBrokerList() {
        try {
          const response: any = await createGetBrokersRequest(
            curPage,
            BROKERS_PER_PAGE,
          );
          console.log(response);
          setBrokerList(response.data.docs);
        } catch (err) {
          const errors = err as AxiosError;
        }
      }
      fetchBrokerList();
      // const response = createGetBrokersRequest();
      // setBrokerList(response.data.docs);
    } catch (err) {
      console.log(err);
    }
    // const fetchConfig = {
    //   url: "/api/v1/users",
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     accept: "application/json",
    //   },
    //   withCredentials: true,
    // };
    // const datahandleFn = async (response: any) => {
    //   console.log(response);
    //   console.log(response.status);
    //   setBrokerList(response.data.docs);
    // };
  }, []);

  const onChangePageHandler = (page: number) => {
    console.log(page);
    setCurPage(page);
  };

  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <Pagetitle
                  title={t('broker_title')}
                  intro={t('broker_description')}
                />
                {/* <Pagetitle
                  title="Broker List"
                  intro="Every request ID is meticulously recorded in this log. For more details, please review them carefully."
                /> */}

                <div className="row ps-2 pe-2" id={styles['all-brokers']}>
                  {/* {brokerList &&
                    brokerList.length > 0 &&
                    brokerList.map((broker, index) => (
                      <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                          <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                            <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                              <Image
                                src={'http://'}
                                width={100}
                                height={100}
                                alt="avater"
                                className="float-right p-0 bg-white rounded-circle w-100 shadow-xss"
                              />
                            </figure>
                            <div className="clearfix w-100"></div>
                            <h4 className="fw-700 font-xsss mt-3 mb-0">

                            </h4>
                            <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">

                            </p>
                            <a
                              href="/defaultmember"
                              className="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-success font-xsssss fw-700 ls-lg text-white"
                            >
                              ADD FRIEND
                            </a>
                          </div>
                        </div>
                      </div>
                    ))} */}

                  {memberList.map((value, index) => (
                    <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                      <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                        <div
                          className={`${styles['broker-profile']} card-body d-block w-100`}
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
                            <h4 className="fw-700 mt-3 mb-0">Courtney Henry</h4>
                            <div className={`${styles['broker-skill']} my-1`}>
                              <FontAwesomeIcon
                                icon={faSuitcase}
                                className={`${styles['broker-icon']} fa-thin fa-suitcase me-2`}
                              ></FontAwesomeIcon>
                              Stock
                            </div>
                          </div>
                          {/* Broker's data */}
                          <div className={styles['profile-data']}>
                            <div className="row d-flex w-100 m-0">
                              <div className="col p-0">
                                <div>Followers</div>
                                <div className={styles['broker-stats']}>
                                  88.7k
                                </div>
                              </div>
                              <div className="col p-0">
                                <div>Enrolled</div>
                                <div className={styles['broker-stats']}>
                                  453
                                </div>
                              </div>
                            </div>

                            <div className="row d-flex w-100 mt-2 m-0">
                              <div className="col p-0">
                                <div>Rating</div>
                                <div>star</div>
                              </div>
                              <div className="col p-0">
                                <div>Ranking</div>
                                <div>rank</div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className={`${styles['follow-btn']} main-btn bg-current text-center text-white fw-500 w-100 border-0 d-inline-block`}
                          >
                            Follow
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Stack spacing={2}>
                  <Pagination
                    count={pagination}
                    variant="outlined"
                    color="secondary"
                    onClick={(e) =>
                      onChangePageHandler(
                        parseInt(e.currentTarget.textContent || '1', 10),
                      )
                    }
                    sx={{
                      '.MuiPagination-ul': { 'justify-content': 'center' },
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
