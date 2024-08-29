import { dataExperiencesProfile } from "@/app/fakeData/profile";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { TruncateText } from "../TruncateText";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile, FormDtCompany } from "@/api/profile/model";
import { ModalExperience } from "./ModalExperience";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { deleteCompany } from "@/api/profile";

export const Experience = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [showAllExperiences, setshowAllExperiences] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [iconEdit, setShowIconEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formDt, setFormDt] = useState<FormDtCompany>({
    id: "",
    logo: "",
    name: "",
    startDate: "",
    endDate: "",
    isWorking: true,
    position: "",
    location: "",
    description: "",
    workingType: "",
  });

  const [company, setCompany] = useState(dataBrokerProfile.company ?? []);

  const experiencesToShow = showAllExperiences ? company : company.slice(0, 5);

  const calculateDuration = useCallback(
    (startDate: string, endDate: string): string => {
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      let years = end.diff(start, "year");

      let months = end.diff(start.add(years, "year"), "month");

      let result = "0";
      if (years > 0) {
        result += `${years} yr${years > 1 ? "s" : ""}`;
      }
      if (months > 0) {
        if (result.length > 0) {
          result += " ";
        }
        result += `${months} mo${months > 1 ? "s" : ""}`;
      }

      return result;
    },
    [],
  );
  const handleAddModal = useCallback(() => {
    setIsEditing(false);
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const handleEditModal = useCallback((experience: FormDtCompany) => {
    setIsEditing(true);
    setShow(true);
    setFormDt(experience);
  }, []);

  const handleOpenEdit = useCallback(() => {
    setShowIconEdit(true);
  }, []);

  const delCompany = useCallback(async (id: string) => {
    try {
      if (id) {
        await deleteCompany(id);
        setCompany((prev) => prev.filter((com) => com.id !== id));
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
          <h2 className="m-0 fw-600 mb-4">{t("experience")}</h2>
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
                {company.length != 0 && (
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
              <Image
                src={
                  experience.logo ||
                  "/assets/images/profile/alabaster_global_logo.png"
                }
                width={48}
                height={48}
                alt={experience.name}
                style={{
                  objectFit: "cover",
                }}
              />
              <div className="w-100">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="m-0 fw-600 font-xss">{experience.name}</p>
                  {iconEdit && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "4px",
                      }}
                    >
                      <i
                        className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                        onClick={() => handleEditModal(experience)}
                      ></i>
                      <i
                        className={`bi bi-trash3-fill ${styles["icon-profile"]}`}
                        onClick={() => delCompany(experience.id)}
                      ></i>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <p className="m-0 font-xsss lh-20">{experience.position}</p>
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
                    {experience.workingType}
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
                    {dayjs(experience.startDate).format("MMM-YYYY")} -{" "}
                    {experience.isWorking
                      ? "Present"
                      : dayjs(experience.endDate).format("MMM-YYYY")}
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
                    {calculateDuration(
                      experience.startDate,
                      experience.endDate,
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
          company.length - experiencesToShow.length > 0 && (
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
                  {dataExperiencesProfile.length - experiencesToShow.length}{" "}
                  experiences
                </p>

                <i
                  className={`bi bi-arrow-right ${styles["icon-profile"]}`}
                ></i>
              </button>
            </>
          )}
      </div>
      {show && (
        <ModalExperience
          handleClose={handleCancel}
          isEditing={isEditing}
          title={isEditing ? "Edit experience" : "Create experience"}
          show={show}
          dataBrokerProfile={dataBrokerProfile}
          formDt={formDt}
          setCompany={setCompany}
          // editId={editId}``
        />
      )}
    </>
  );
};
