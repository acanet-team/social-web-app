import React, { useState } from "react";
import { dataEducationProfile } from "@/app/fakeData/profile";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile } from "@/api/profile/model";

// const Education = ({
//   dataBrokerProfile,
// }: {
//   dataBrokerProfile: BrokerProfile;
// }) => {
const Education = ({ role }: { role: boolean }) => {
  const [showAllEducation, setshowAllEducation] = useState<boolean>(false);
  const educationToShow = showAllEducation
    ? dataEducationProfile
    : dataEducationProfile.slice(0, 2);

  return (
    <div
      className="card p-4"
      style={{
        background: "#FFFFFF",
        borderRadius: "15px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h2 className="m-0 fw-600 mb-4">Education</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Image
            src="/assets/images/profile/icons8-plus-100 3.png"
            width={35}
            height={35}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          /> */}
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
          {/* <Image
            src="/assets/images/profile/icons8-edit-100 6.png"
            width={20}
            height={20}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          /> */}
        </div>
      </div>
      {educationToShow.map((education, index) => (
        <>
          <div
            key={education.id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
            }}
          >
            <Image
              src={education.school_logo}
              width={48}
              height={48}
              alt={education.school_name}
              style={{
                objectFit: "cover",
              }}
            />
            <div>
              <p className="m-0 fw-600 font-xss">{education.school_name}</p>
              <p className="m-0 font-xsss lh-20">{education.degree}</p>
              <p className="m-0 font-xsss lh-20 text-gray-follow">
                {education.start_year} - {education.end_year}
              </p>
              <p className="m-0 mt-2 font-xsss lh-20 text-gray-follow">
                Activities and societies {education.activities}
              </p>
            </div>
          </div>
          {index < educationToShow.length - 1 && (
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #d1d1d1",
                marginTop: "20px",
              }}
            />
          )}
        </>
      ))}
      {!showAllEducation &&
        dataEducationProfile.length - educationToShow.length > 0 && (
          <>
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #d1d1d1",
                marginTop: "20px",
              }}
            />
            <button
              onClick={() => setshowAllEducation(!showAllEducation)}
              style={{
                border: "none",
                cursor: "pointer",
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: "4px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="m-0 font-xss fw-600">
                Show all {dataEducationProfile.length - educationToShow.length}{" "}
                educations
              </p>
              <i className={`bi bi-arrow-right ${styles["icon-profile"]}`}></i>
              {/* <Image
                src="/assets/images/profile/arrow-right-small.png"
                width={16}
                height={16}
                alt=""
                className=""
                style={{
                  objectFit: "cover",
                }}
              /> */}
            </button>
          </>
        )}
    </div>
  );
};

export default Education;
