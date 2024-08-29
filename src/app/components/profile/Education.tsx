import React, { useCallback, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile, FormDtSchool } from "@/api/profile/model";
import { ModalEducation } from "./ModalEducation";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { deleteEducation } from "@/api/profile";

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

  const [formDt, setFormDt] = useState<FormDtSchool>({
    id: "",
    name: "",
    logo: "",
    startDate: "",
    endDate: "",
    isGraduated: true,
    major: "",
    degree: "",
    description: "",
  });
  const [school, setSchool] = useState(dataBrokerProfile.school ?? []);
  const educationToShow = showAllEducation ? school : school.slice(0, 2);

  const handleAddModal = useCallback(() => {
    setIsEditing(false);
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const handleEditModal = useCallback((school: FormDtSchool) => {
    setIsEditing(true);
    setShow(true);
    setFormDt(school);
  }, []);

  const handleOpenEdit = useCallback(() => {
    setShowIconEdit(true);
  }, []);

  const delEdu = useCallback(async (id: string) => {
    try {
      if (id) {
        await deleteEducation(id);
        setSchool((prev) => prev.filter((edu) => edu.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
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
                {school.length != 0 && (
                  <h4>
                    <i
                      className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                      onClick={() => handleOpenEdit()}
                    ></i>
                  </h4>
                )}
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
                src={
                  education.logo ||
                  "/assets/images/profile/alabaster_global_logo.png"
                }
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
                          onClick={() => handleEditModal(education)}
                        ></i>
                        <i
                          className={`bi bi-trash3-fill ${styles["icon-profile"]}`}
                          onClick={() => delEdu(education.id)}
                        ></i>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="m-0 font-xsss lh-20">{education.degree}</p>
                  <p className="m-0 font-xsss lh-20">,{education.major}</p>
                </div>
                <p className="m-0 font-xsss lh-20 text-gray-follow">
                  {dayjs(education.startDate).format("YYYY")} -{" "}
                  {education.isGraduated
                    ? "Present"
                    : dayjs(education.endDate).format("YYYY")}
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
      {show && (
        <ModalEducation
          handleClose={handleCancel}
          isEditing={isEditing}
          title={isEditing ? "Edit education" : "Create education"}
          show={show}
          formDt={formDt}
          setSchool={setSchool}
        />
      )}
    </>
  );
};

export default Education;
