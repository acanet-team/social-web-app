import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile, User } from "@/api/profile/model";
import { useTranslations } from "next-intl";

const AiSummary = ({
  dataBrokerProfile,
  role,
  dataUser,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
  dataUser: User;
}) => {
  const t = useTranslations("MyProfile");
  const [showAllInterestTopics, setShowAllInterestTopics] =
    useState<boolean>(false);
  const [showAllServiceOffer, setShowAllServiceOffer] =
    useState<boolean>(false);
  const interestTopics = dataBrokerProfile.interestTopics ?? [];
  const skills = dataBrokerProfile.skills ?? [];

  // const interestToShow = showAllInterestTopics
  //   ? interestTopics
  //   : interestTopics.slice(0, 3);
  // const serviceToShow = showAllServiceOffer ? skills : skills.slice(0, 2);

  return (
    <div
      className="card p-4"
      style={{
        background: "#FFFFFF",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRadius: "15px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2px",
        }}
      >
        <p className="m-0 fw-700 font-xsss">{t("AI summary")}</p>
        <Image
          src="/assets/images/profile/icons8-lightning-96 1.png"
          width={25}
          height={25}
          alt=""
          className=""
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <p className="m-0 fw-400 font-xsss">
        Diep Kieu Trang is a seasoned tech entrepreneur and executive with
        extensive experience leading major technology companies. She is known
        for her expertise in business strategy, leadership, and fostering
        innovation.{" "}
      </p>
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #d1d1d1",
          marginTop: "20px",
        }}
      />
      <div className="mb-2">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="m-0 fw-700 font-xssss">{t("contact")}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {role === true && (
              <>
                <h1>
                  <i className={`bi bi-plus-lg ${styles["icon-profile"]}`}></i>
                </h1>
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                  ></i>
                </h4>
              </>
            )}
          </div>
        </div>
        <p className="m-0 fw-500 font-xssss text-gray-follow">
          {dataUser?.email}
        </p>
      </div>

      <div className="mb-2">
        <p className="m-0 fw-700 font-xssss">{t("servicesOffer")}</p>
        {skills.map((service) => (
          <div key={service.id}>
            <p className="m-0 fw-500 font-xssss text-gray-follow">
              {service.interestTopics?.topicName}
            </p>
          </div>
        ))}
        {/* {!showAllServiceOffer &&
          dataBrokerProfile.skills.length - serviceToShow.length > 0 && (
            <span onClick={() => setShowAllServiceOffer(true)}>....</span>
          )} */}
      </div>

      <div className="mb-2">
        <p className="m-0 fw-700 font-xssss">{t("location")}</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">
          {dataBrokerProfile?.location}
        </p>
      </div>
      <div className="">
        <p className="m-0 fw-700 font-xssss">{t("interestTopic")}</p>
        {interestTopics.map((topic) => (
          <div key={topic.id}>
            <p className="m-0 fw-500 font-xssss text-gray-follow">
              {topic.topicName}
            </p>
          </div>
        ))}
        {/* {!showAllInterestTopics &&
          dataBrokerProfile.interestTopics.length - interestToShow.length >
            0 && (
            <span onClick={() => setShowAllInterestTopics(true)}>....</span>
          )} */}
      </div>
    </div>
  );
};

export default AiSummary;
