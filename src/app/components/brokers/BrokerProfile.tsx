"use client";
import React from "react";
import Image from "next/image";
import styles from "@/styles/modules/brokers.module.scss";
import { faSuitcase, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BrokerProfile(props: {
  brokerProfileId: string;
  firstName: string;
  lastName: string;
  topicName: string;
  followersCount: number;
  coursesEnrolledCount: number;
  rating: number;
  rank: string;
  photoUrl: string;
}) {
  const {
    brokerProfileId,
    firstName,
    lastName,
    topicName,
    followersCount = 0,
    coursesEnrolledCount = 0,
    rating = 0,
    rank,
    photoUrl,
  } = { ...props };
  const onFollowBrokerHandler = (brokerId: string) => {
    console.log("follow a broker...");
  };
  return (
    <div className="col-md-3 col-sm-4 pe-2 ps-2">
      <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
        <div className={`${styles["broker-profile"]} card-body d-block w-100`}>
          <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative z-index-1">
            <Image
              src={
                photoUrl ? photoUrl : "https://via.placeholder.com/300x300.png"
              }
              width={211}
              height={211}
              alt="avatar"
              className={`${styles["broker-profile-img"]} shadow-sm rounded-3`}
            />
          </figure>
          <div className="ms-1">
            <h4 className="fw-700 mt-3 mb-0">{firstName + " " + lastName}</h4>
            <div className={`${styles["broker-skill"]} my-1`}>
              <FontAwesomeIcon
                icon={faSuitcase}
                className={`${styles["broker-icon"]} fa-thin fa-suitcase me-2`}
              ></FontAwesomeIcon>
              {topicName}
            </div>
          </div>
          {/* Broker's data */}
          <div className={styles["profile-data"]}>
            <div className="row d-flex w-100 m-0">
              <div className="col p-0">
                <div>Followers</div>
                <div className={styles["broker-stats"]}>
                  {followersCount >= 1000
                    ? (followersCount / 1000).toFixed(1)
                    : followersCount}{" "}
                  {followersCount >= 1000 ? "k" : ""}
                </div>
              </div>
              <div className="col p-0">
                <div>Enrolled</div>
                <div className={styles["broker-stats"]}>
                  {coursesEnrolledCount >= 1000
                    ? (coursesEnrolledCount / 1000).toFixed(1)
                    : coursesEnrolledCount}{" "}
                  {coursesEnrolledCount >= 1000 ? "k" : ""}
                </div>
              </div>
            </div>

            <div className="row d-flex w-100 mt-2 m-0">
              <div className="col p-0">
                <div>Rating</div>
                {Array.from({ length: Math.round(rating) }, (_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className={`${styles["broker-icon"]} fa-solid fa-star me-2`}
                    style={{ color: "#FFD43B" }}
                  ></FontAwesomeIcon>
                ))}
                {Array.from({ length: 5 - Math.round(rating) }, (_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className={`${styles["broker-icon"]} fa-regular fa-star me-2`}
                  ></FontAwesomeIcon>
                ))}
              </div>
              <div className="col p-0">
                <div>Ranking</div>
                <div>{rank}</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`${styles["follow-btn"]} main-btn bg-current text-center text-white fw-500 w-100 border-0 d-inline-block`}
            onClick={() => onFollowBrokerHandler(brokerProfileId)}
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
