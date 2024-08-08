"use client";
import React, { useEffect, useState } from "react";
import BrokerProfile from "./BrokerProfile";
import styles from "@/styles/modules/brokers.module.scss";
import Pagination from "../Pagination";
import { createGetBrokersRequest } from "@/api/user";
import CircleLoader from "../CircleLoader";
import Link from "next/link";

export default function Brokers(props: { onNextHandler: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const TAKE = 18;

  // console.log(brokers);

  useEffect(() => {
    async function getBrokers() {
      try {
        setIsLoading(true);
        const res = await createGetBrokersRequest(page, TAKE);
        setBrokers(res.data.docs ? res.data.docs : res.data.data || []);
        console.log(res.data.docs);

        setPage(res.data.meta.page);
        setTotalPage(res.data.meta.totalPage);
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
            photo={b.photo}
            topicName={b.skills[0]?.topicName}
            followersCount={b.followersCount}
            coursesEnrolledCount={b.coursesEnrolledCount}
            rating={b.rating}
            rank={b.rank}
          />
        ))}
      <Pagination pageUpdateFn={setPage} page={page} totalPage={totalPage} />

      <Link href="/home" className="btn mt-3 mb-5 mx-auto">
        <button className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-5 mx-auto">
          Finish
        </button>
      </Link>
    </div>
  );
}
