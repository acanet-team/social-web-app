import React, { useCallback, useState } from "react";
import { dataEducationProfile } from "@/app/fakeData/profile";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile } from "@/api/profile/model";
import { ModalEducation } from "./ModalEducation";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

const Education = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [showAllEducation, setshowAllEducation] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [iconEdit, setShowIconEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const school = dataBrokerProfile.school ?? [];
  const educationToShow = showAllEducation ? school : school.slice(0, 2);

  const handleAddModal = useCallback(() => {
    setIsEditing(false);
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const handleEditModal = useCallback(() => {
    setIsEditing(true);
    setShow(true);
  }, [show]);

  const handleOpenEdit = useCallback(() => {
    setShowIconEdit(true);
  }, []);

  return (
    <>
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
          <h2 className="m-0 fw-600 mb-4">{t("education")}</h2>
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
                  <i
                    className={`bi bi-plus-lg ${styles["icon-profile"]}`}
                    onClick={() => handleAddModal()}
                  ></i>
                </h1>
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                    onClick={() => handleOpenEdit}
                  ></i>
                </h4>
              </>
            )}
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
                src={education.logo}
                width={48}
                height={48}
                alt={education.name}
                style={{
                  objectFit: "cover",
                }}
              />
              <div className="w-100">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="m-0 fw-600 font-xss">{education.name}</p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    }}
                  >
                    {iconEdit && (
                      <>
                        <i
                          className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                          onClick={() => handleEditModal()}
                        ></i>
                        <i
                          className={`bi bi-trash3-fill ${styles["icon-profile"]}`}
                        ></i>
                      </>
                    )}
                  </div>
                </div>
                <p className="m-0 font-xsss lh-20">{education.degree}</p>
                <p className="m-0 font-xsss lh-20 text-gray-follow">
                  {dayjs(education.startDate).format("YYYY")} -{" "}
                  {dayjs(education.endDate).format("YYYY")}
                </p>
                <p className="m-0 mt-2 font-xsss lh-20 text-gray-follow">
                  Activities and societies {education.description}
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
        {!showAllEducation && school.length - educationToShow.length > 0 && (
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
                Show all {school.length - educationToShow.length} educations
              </p>
              <i className={`bi bi-arrow-right ${styles["icon-profile"]}`}></i>
            </button>
          </>
        )}
      </div>
      {/* {show && (
        <ModalEducation
          handleClose={handleCancel}
          // handleShow={handleOpenModal}
          isEditing={isEditing}
          title={isEditing ? "Edit education" : "Create education"}
          show={show}
        />
      )} */}
    </>
  );
};

export default Education;
