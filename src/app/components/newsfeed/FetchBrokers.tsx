"use client";
import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { createGetBrokersRequest } from "@/api/user";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TopBrokers } from "./TopBrokers";

const getTopBrokers = async () => {
  try {
    const response = await createGetBrokersRequest(1, 20);
    return response.data;
  } catch (err) {
    console.log(err);
    return { data: [], meta: { page: 1, totalPage: 1 } };
  }
};

export const FetchBrokers = () => {
  const [brokers, setBrokers] = useState<any[]>([]);
  useEffect(() => {
    const fetchBrokers = async () => {
      const data = await getTopBrokers();
      const topBrokers = data.docs || data.data || [];
      setBrokers(topBrokers);
      console.log(topBrokers);
    };

    fetchBrokers();
  }, []);

  const memoizedBrokers = useMemo(() => brokers, [brokers]);

  const brokersettings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
  };

  return (
    <div>
      <Slider {...brokersettings}>
        {memoizedBrokers?.length > 0 &&
          memoizedBrokers.map((b, index) => (
            <TopBrokers
              key={b.userId}
              photoUrl={b.photoUrl}
              firstName={b.firstName}
              lastName={b.lastName}
              followersCount={b.followersCount}
            />
          ))}
      </Slider>
    </div>
  );
};
