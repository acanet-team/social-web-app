import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type {
  BrokerProfile,
  Company,
  FormDtCompany,
} from "@/api/profile/model";
import { ModalExperience } from "./ModalExperience";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { deleteCompany } from "@/api/profile";
import WaveLoader from "../WaveLoader";

export const Experience = ({
  dataBrokerProfile,
  role,
  id,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
  id: string;
}) => {
  const t = useTranslations("MyProfile");
  const [showAllExperiences, setshowAllExperiences] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [iconEdit, setShowIconEdit] = useState(false);
  const [iconBack, setShowIconBack] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
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

  const [company, setCompany] = useState<Company[]>([]);
  useEffect(() => {
    setCompany(dataBrokerProfile?.company ?? []);
  }, [dataBrokerProfile]);

  const experiencesToShow = showAllExperiences ? company : company?.slice(0, 5);

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();

    let years = end.diff(start, "year");

    let months = end.diff(start.add(years, "year"), "month");

    let result = "";
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
  };
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
    setShowIconBack(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setShowIconEdit(false);
    setShowIconBack(false);
  }, []);

  const delCompany = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        if (id) {
          await deleteCompany(id);
          setCompany((prev) => prev.filter((com) => com.id !== id));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [id],
  );

  return (
    <>
      <div className="card border-0 shadow-xss bg-white rounded-3 p-4 mt_2">
        <div className="d-flex justify-content-between algin-items-center">
          <h2 className="m-0 fw-600 mb-4">{t("experience")}</h2>
          <div className="d-flex justify-content-center align-items-center">
            {role === true && (
              <>
                <h1>
                  <i
                    className={`bi bi-plus-lg me-1 ${styles["icon-profile"]} cursor-pointer`}
                    onClick={() => handleAddModal()}
                  ></i>
                </h1>
                {company?.length > 0 && (
                  <>
                    {iconBack ? (
                      <h4>
                        <i
                          className={`bi bi-arrow-left me-1 ${styles["icon-profile"]} cursor-pointer`}
                          onClick={() => handleCloseEdit()}
                        ></i>
                      </h4>
                    ) : (
                      <h4>
                        <i
                          className={`bi bi-pencil-fill ${styles["icon-profile"]} cursor-pointer`}
                          onClick={() => handleOpenEdit()}
                        ></i>
                      </h4>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {experiencesToShow?.length > 0 &&
          experiencesToShow?.map((experience, index) => (
            <div key={experience.id}>
              <div className="d-flex justify-content-center align-items-center">
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
                <div className="w-100 ms-3">
                  <div className="d-flex justify-content-between">
                    <p className="m-0 fw-600 font-xs">
                      {expandPost
                        ? experience.name
                        : experience.name.length > 20
                          ? experience.name.substring(0, 20) + "..."
                          : experience.name}
                    </p>

                    {iconEdit && (
                      <div className="d-flex ">
                        <i
                          className={`bi bi-pencil-fill me-1 ${styles["icon-profile"]} cursor-pointer`}
                          onClick={() => handleEditModal(experience)}
                        ></i>
                        <i
                          className={`bi bi-trash3-fill ${styles["icon-profile"]} cursor-pointer`}
                          onClick={() => delCompany(experience.id)}
                        ></i>
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="m-0 font-xss lh-20">{experience.position}</p>
                    {experience.position && experience.workingType && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "3px",
                          height: "3px",
                          borderRadius: "100%",
                          backgroundColor: "#000",
                          marginLeft: "8px",
                          marginRight: "8px",
                        }}
                      ></span>
                    )}
                    <p className="m-0 font-xss lh-20">
                      {experience.workingType}
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="m-0 font-xss lh-20 text-gray-follow me-2">
                      {dayjs(experience.startDate).format("MMM-YYYY")} -{" "}
                      {experience.isWorking
                        ? "Present"
                        : dayjs(experience.endDate).format("MMM-YYYY")}
                    </p>
                    {calculateDuration(
                      experience.startDate,
                      experience.endDate,
                    ) && (
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
                    )}
                    <p className="m-0 font-xss lh-20 text-gray-follow ms-2">
                      {calculateDuration(
                        experience.startDate,
                        experience.endDate,
                      )}
                    </p>
                  </div>
                  <p className="m-0 font-xss lh-20 text-gray-follow">
                    {experience.location}
                  </p>
                  {expandPost
                    ? experience.description
                    : experience.description.length > 20
                      ? experience.description.substring(0, 20) + "..."
                      : experience.description}
                  {experience.description.length > 20 && !expandPost ? (
                    <span
                      className={"cursor-pointer text-blue"}
                      onClick={() => setExpandPost((open) => !open)}
                    >
                      {t("See more")}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {index < experiencesToShow?.length - 1 && (
                //  <hr className="border-none mt-3 border-top-md" />
                <hr
                  style={{
                    border: "none",
                    borderTop: "2px solid #d1d1d1",
                    marginTop: "20px",
                  }}
                />
              )}
            </div>
          ))}
        {!showAllExperiences &&
          company?.length - experiencesToShow?.length > 0 && (
            <>
              {/* <hr className="border-none mt-3 border-top-md" /> */}
              <hr
                style={{
                  border: "none",
                  borderTop: "2px solid #d1d1d1",
                  marginTop: "20px",
                }}
              />
              <button
                onClick={() => setshowAllExperiences(!showAllExperiences)}
                className="border-none d-flex justify-content-center align-items-center bg-none cursor-pointer"
              >
                <p className="m-0 font-xss fw-600">
                  {t("Show all")} {company?.length - experiencesToShow?.length}{" "}
                  {t("experiences")}
                </p>

                <i
                  className={`bi bi-arrow-right ${styles["icon-profile"]} cursor-pointer`}
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
          idUser={id}
        />
      )}
      {isLoading && <WaveLoader />}
    </>
  );
};
