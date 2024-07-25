import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import styles from "@/styles/modules/topBrokers.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const storyList = [
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "Aliqa Macale ",
    email: "support@gmail.com",
  },
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "Seary Victor ",
    email: "support@gmail.com",
  },
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "John Steere ",
    email: "support@gmail.com",
  },
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "Mohannad ",
    email: "support@gmail.com",
  },
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "Studio ",
    email: "support@gmail.com",
  },
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "Hendrix ",
    email: "support@gmail.com",
  },
  {
    bgUrl: "story.png",
    imageUrl: "user.png",
    name: "Zitoun ",
    email: "support@gmail.com",
  },
];

export default function TopBrokers() {
  const [topBrokers, setTopBrokers] = useState<Object[]>([]);
  const storysettings = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
  };

  useEffect(() => {
    // Call api to fetch top brokers
  }, []);
  return (
    <Slider {...storysettings}>
      {storyList.map((value, index) => (
        <div
          key={index}
          className={styles["image-slider-container"]}
          id={styles["top-brokers"]}
        >
          <div className="card w140 h200 d-block border-0 shadow-xss rounded-xxxl bg-gradiant-bottom overflow-hidden cursor-pointer mb-3 mt-0 me-3 mt-3">
            <div className="card-body d-block w-100 ps-4 pe-4 pb-4 text-center">
              <figure className="avatar overflow-hidden ms-auto me-auto mb-0 position-relative w75 z-index-1">
                <Image
                  src={`/assets/images/${value.imageUrl}`}
                  alt="avater"
                  width={75}
                  height={75}
                  className="float-right p-1 bg-white rounded-circle w-100"
                />
              </figure>
              <div className="clearfix"></div>
              <h4 className="fw-700 font-xsss mt-2 mb-1">broker</h4>
              <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-2">
                54k followers
              </p>
              <span
                className={`${styles["follow-btn"]} mt-2 mb-0 p-2 z-index-1 rounded-3 text-white font-xsssss text-uppersace fw-700 ls-3`}
              >
                Follow
              </span>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}
