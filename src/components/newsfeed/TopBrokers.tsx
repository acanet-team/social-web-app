import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/topBrokers.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { followABroker } from "@/api/onboard";
import Link from "next/link";
import { useTranslations } from "next-intl";

/* eslint-disable react/display-name */
export const TopBrokers = (props: {
  photoUrl: string;
  firstName: string;
  lastName: string;
  followersCount: number;
  brokerId: number;
  rank: string;
}) => {
  const tBase = useTranslations("Base");
  const { photoUrl, firstName, lastName, followersCount, brokerId } = props;
  const [followerNum, setFollowerNum] = useState<number>(
    Number(followersCount),
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const firstNameArr = firstName.split(" ");
  const lastNameArr = lastName.split(" ");
  const displayName = `${firstNameArr[firstNameArr.length - 1]} ${lastNameArr[0]}`;
  const [colorRank, setColorRank] = useState<string>("");

  const onFollowBrokerHandler = (e: any, brokerId: number) => {
    try {
      setIsFollowing((following) => !following);
      // Calling api
      followABroker({
        userId: brokerId,
        followType: isFollowing ? "UNFOLLOW" : "FOLLOW",
      });
      if (!isFollowing) {
        e.target.classList.add(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState + 1);
      } else {
        e.target.classList.remove(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState - 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    switch (props.rank) {
      case "Verified":
        setColorRank(
          "linear-gradient(180deg, #206d5d 0%, #3ca859 50%, #34a375 100%)",
        );
        break;
      case "Pro":
        setColorRank(
          "linear-gradient(180deg, #050383 0%, #3b3efd 50%, #727496 100%)",
        );
        break;
      case "Expert":
        setColorRank(
          "linear-gradient(180deg, #333534 0%, #606361 50%, #ced4d2 100%)",
        );
        break;
      case "Master":
        setColorRank(
          "linear-gradient(180deg, #916b03 0%, #ccb011 50%, #dad9a4 100%)",
        );
        break;
      default:
        setColorRank("white");
        break;
    }
  }, [props.rank]);

  return (
    <div
      className={styles["image-slider-container"]}
      id={styles["top-brokers"]}
    >
      <div className="card w140 h210 d-block border-0 shadow-md bg-light rounded-xxl overflow-hidden mb-3 me-3">
        <div className="card-body d-block w-100 ps-4 pe-4 pb-4 text-center">
          <Link href={`/profile/${brokerId}`}>
            <figure className="avatar overflow-hidden ms-auto me-auto mb-0 position-relative w75 z-index-1">
              <Image
                src={photoUrl ? photoUrl : "/assets/images/user.png"}
                alt="avatar"
                width={75}
                height={75}
                className={`${styles["broker-ava__effect"]} rounded-circle`}
                style={{ background: colorRank }}
              />
            </figure>
            <div className="clearfix"></div>
            <h4 className="fw-700 font-xsss mt-2 mb-1">{displayName}</h4>
          </Link>
          <p className="fw-500 font-xssss text-grey-700 mt-0 mb-2">
            {followerNum >= 1000
              ? (followerNum / 1000).toFixed(1)
              : followerNum}{" "}
            {followerNum >= 1000 ? "k" : ""}{" "}
            {followerNum > 1 ? tBase("followers") : tBase("follower")}
          </p>
          <span
            className={`${styles["follow-btn"]} mt-2 mb-0 px-3 py-2 z-index-1 rounded-3 text-white font-xsssss cursor-pointer text-uppersace fw-700 ls-3`}
            onClick={(e) => onFollowBrokerHandler(e, brokerId)}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </span>
        </div>
      </div>
    </div>
  );
};
