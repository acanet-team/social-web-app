'use client';
import React, { Fragment, useEffect, useState } from 'react';
import Pagetitle from '@/app/components/Pagetitle';
import useAxios from '@/hooks/useAxios';
import Image from 'next/image';
import type { AxiosError } from 'axios';
import { createGetBrokersRequest } from '@/api/user';
import { getTranslations } from 'next-intl/server';
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
  // const t = useTranslations('BrokerList');
  const [brokerList, setBrokerList] = useState([]);

  useEffect(() => {
    try {
      async function fetchBrokerList() {
        try {
          const response: any = await createGetBrokersRequest();
          console.log(response);
          setBrokerList(response.data.docs);
        } catch (err) {
          const errors = err as AxiosError;
        }
      }
      fetchBrokerList();
    } catch (err) {}
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

  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                {/* <Pagetitle title={t('broker_title')} intro={t('broker_description')} /> */}

                <div className="row ps-2 pe-2">
                  {brokerList &&
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
                              {/* {value.name}{' '} */}
                            </h4>
                            <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                              {/* {value.user} */}
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
                    ))}
                  {/* {memberList.map((value, index) => (
                    <div key={index} className="col-md-3 col-sm-4 pe-2 ps-2">
                      <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                        <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                          <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
                            <img
                              src={`assets/images/${value.imageUrl}`}
                              alt="avater"
                              className="float-right p-0 bg-white rounded-circle w-100 shadow-xss"
                            />
                          </figure>
                          <div className="clearfix w-100"></div>
                          <h4 className="fw-700 font-xsss mt-3 mb-0">
                            {value.name}{' '}
                          </h4>
                          <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                            {value.user}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
