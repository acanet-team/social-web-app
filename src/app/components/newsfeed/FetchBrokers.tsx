import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createGetBrokersRequest } from "@/api/user";
import TopBrokers from "./TopBrokers";

const getTopBrokers = async () => {
  try {
    const response = await createGetBrokersRequest(1, 20);
    return response.data;
  } catch (err) {
    console.log(err);
    return { data: [], meta: { page: 1, totalPage: 1 } };
  }
};

export default async function FetchBrokers() {
  const data = await getTopBrokers();
  const topBrokers = data.docs || data.data || [];
  console.log(topBrokers);
  const brokersettings = {
    arrows: true,
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
        {topBrokers?.length > 0 &&
          topBrokers.map((b, index) => (
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
}
