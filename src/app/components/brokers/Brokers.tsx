"use client";
import React, { useEffect, useState } from "react";
import BrokerProfile from "./BrokerProfile";
import styles from "@/styles/modules/brokers.module.scss";
import Pagination from "../Pagination";
import { createGetBrokersRequest } from "@/api/user";
import CircleLoader from "../CircleLoader";
import Link from "next/link";

export default function Brokers(props: {
  brokers: Object[];
  page: number;
  totalPage: number;
  take: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brokers, setBrokers] = useState<any[]>(props.brokers);
  const [page, setPage] = useState<number>(props.page);
  // console.log(brokers);

  useEffect(() => {
    async function getBrokers() {
      try {
        setIsLoading(true);
        const res = await createGetBrokersRequest(page, props.take);
        // console.log(res);
        setBrokers(res.data.docs ? res.data.docs : res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getBrokers();
  }, [page]);
  return (
    <div className="row ps-2 pe-2" id={styles["all-brokers"]}>
      {isLoading && <CircleLoader />}
      {!isLoading &&
        brokers?.length > 0 &&
        brokers.map((b) => (
          <BrokerProfile
            key={b.userId}
            brokerProfileId={b.brokerProfileId}
            firstName={b.firstName}
            lastName={b.lastName}
            photoUrl={b.photoUrl}
            topicName={b.skills[0]?.topicName}
            followersCount={b.followersCount}
            coursesEnrolledCount={b.coursesEnrolledCount}
            rating={b.rating}
            rank={b.rank}
          />
        ))}
      <Pagination
        pageUpdateFn={setPage}
        page={page}
        totalPage={props.totalPage}
      />

      <Link href="/home" className="btn mt-3 mb-5 rounded-xxl mx-auto">
        <button className="px-5 py-2 rounded-xxl mx-auto">NEXT</button>
      </Link>
    </div>
  );
}
