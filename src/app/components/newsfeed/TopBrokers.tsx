"use client";
import React, { useState } from "react";
import styles from "@/styles/modules/topBrokers.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

/* eslint-disable react/display-name */
export const TopBrokers =
  (props: {
    photoUrl: string;
    firstName: string;
    lastName: string;
    followersCount: number;
  }) => {
    const { photoUrl, firstName, lastName, followersCount } = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
      <div
        className={styles["image-slider-container"]}
        id={styles["top-brokers"]}
      >
        <div className="card w140 h200 d-block border-0 shadow-xss rounded-xxxl bg-gradiant-bottom overflow-hidden cursor-pointer mb-3 mt-0 me-3 mt-3">
          <div className="card-body d-block w-100 ps-4 pe-4 pb-4 text-center">
            <figure className="avatar overflow-hidden ms-auto me-auto mb-0 position-relative w75 z-index-1">
              <Image
                src={photoUrl ? photoUrl : "/assets/images/user.png"}
                alt="avater"
                width={75}
                height={75}
                className="float-right p-1 bg-white rounded-circle w-100"
              />
            </figure>
            <div className="clearfix"></div>
            <h4 className="fw-700 font-xsss mt-2 mb-1">
              {firstName + " " + lastName}
            </h4>
            <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-2">
              {followersCount >= 1000
                ? (followersCount / 1000).toFixed(1)
                : followersCount}{" "}
              {followersCount >= 1000 ? "k" : ""}{" "}
              {followersCount > 0 ? "followers" : "follower"}
            </p>
            <span
              className={`${styles["follow-btn"]} mt-2 mb-0 p-2 z-index-1 rounded-3 text-white font-xsssss text-uppersace fw-700 ls-3`}
            >
              Follow
            </span>
          </div>
        </div>
      </div>
    );
  };
