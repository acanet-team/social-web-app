import { dataExperiencesProfile } from "@/app/fakeData/profile";
import React, { useState } from "react";
import Image from "next/image";
import { TruncateText } from "../TruncateText";
import styles from "@/styles/modules/profile.module.scss";
import { FormatDate } from "../FormatDate";
import type { BrokerProfile } from "@/api/profile/model";

// export const Experience = ({
//   dataBrokerProfile,
// }: {
//   dataBrokerProfile: BrokerProfile;
// }) => {
export const Experience = ({ role }: { role: boolean }) => {
  const [showAllExperiences, setshowAllExperiences] = useState<boolean>(false);

  const experiencesToShow = showAllExperiences
    ? dataExperiencesProfile
    : dataExperiencesProfile.slice(0, 5);

  // const experiencesToShow = showAllExperiences
  //   ? dataBrokerProfile.company
  //   : dataBrokerProfile.company.slice(0, 5);

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }
    let result = "";
    if (years > 0) {
      result += `${years} yrs`;
    }
    if (months > 0) {
      if (result.length > 0) {
        result += " ";
      }
      result += `${months} mos`;
    }
    return result;
  };

  // const curDate = new Date();
  // const getFormattedCurrentDate = (curDate: Date): string => {
  //   const date = new Date();
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (01-12)
  //   const day = date.getDate().toString().padStart(2, "0"); // Ngày (01-31)
  //   return `${year}-${month}-${day}`;
  // };
  // const currentDate = getFormattedCurrentDate(curDate);

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
        <h2 className="m-0 fw-600 mb-4">Experience</h2>
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
      {experiencesToShow.map((experience, index) => (
        <>
          <div
            key={experience.id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
            }}
          >
            {/* <Image
              src={experience.logo || "/assets/images/profile/alabaster_global_logo.png"}
              width={48}
              height={48}
              alt={experience.name}
              style={{
                objectFit: "cover",
              }}
            /> */}
            <Image
              src="/assets/images/profile/alabaster_global_logo.png"
              width={48}
              height={48}
              alt=""
              style={{
                objectFit: "cover",
              }}
            />
            <div>
              {/* <p className="m-0 fw-600 font-xss">{experience.name}</p> */}
              <p className="m-0 fw-600 font-xss">{experience.company_name}</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <p className="m-0 font-xsss lh-20">{experience.industry}</p>
                <span
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "3px",
                    borderRadius: "100%",
                    backgroundColor: "#000",
                  }}
                ></span>
                <p className="m-0 font-xsss lh-20">
                  {experience.employment_type}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <p className="m-0 font-xsss lh-20 text-gray-follow">
                  {/* {FormatDate(experience.startDate)} -{" "}
                  {experience.isWorking
                    ? "Present"
                    : FormatDate(experience.endDate)} */}
                  {FormatDate(experience.start_date)} -{" "}
                  {FormatDate(experience.end_date)}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "3px",
                    borderRadius: "100%",
                    backgroundColor: "#000",
                    color: "#8b8d8d",
                  }}
                ></span>
                <p className="m-0 font-xsss lh-20 text-gray-follow">
                  {/* {calculateDuration(experience.startDate, experience.endDate)} */}
                  {calculateDuration(
                    experience.start_date,
                    experience.end_date,
                  )}
                </p>
              </div>
              <p className="m-0 font-xsss lh-20 text-gray-follow">
                {experience.location}
              </p>
              <TruncateText
                content={experience.description}
                wordLimit={20}
                className="font-xsss lh-20"
              />
            </div>
          </div>
          {index < experiencesToShow.length - 1 && (
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
      {!showAllExperiences &&
        // dataBrokerProfile.company.length - experiencesToShow.length > 0 && (
        dataExperiencesProfile.length - experiencesToShow.length > 0 && (
          <>
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #d1d1d1",
                marginTop: "20px",
              }}
            />
            <button
              onClick={() => setshowAllExperiences(!showAllExperiences)}
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
                Show all{" "}
                {/* {dataBrokerProfile.company.length - experiencesToShow.length}{" "} */}
                {dataExperiencesProfile.length - experiencesToShow.length}{" "}
                experiences
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
