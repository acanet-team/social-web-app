import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile, FormDtSchool, School } from "@/api/profile/model";
import { ModalEducation } from "./ModalEducation";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { deleteEducation } from "@/api/profile";
import WaveLoader from "../WaveLoader";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iconBack, setShowIconBack] = useState(false);

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
  const [school, setSchool] = useState<School[]>([]);
  useEffect(() => {
    setSchool(dataBrokerProfile?.school);
  }, [dataBrokerProfile]);
  const educationToShow = showAllEducation ? school : school?.slice(0, 2);

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
    setShowIconBack(true);
  }, []);
  const handleCloseEdit = useCallback(() => {
    setShowIconEdit(false);
    setShowIconBack(false);
  }, []);

  const delEdu = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (id) {
        await deleteEducation(id);
        setSchool((prev) => prev.filter((edu) => edu.id !== id));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <div className="card border-0 shadow-xss bg-white rounded-3 p-4 mt_2">
        <div className="d-flex justify-content-between algin-items-center">
          <h2 className="m-0 fw-600 mb-4">{t("education")}</h2>
          <div className="d-flex justify-content-center align-items-center">
            {role === true && (
              <>
                <h1>
                  <i
                    className={`bi bi-plus-lg me-1 ${styles["icon-profile"]} cursor-pointer`}
                    onClick={() => handleAddModal()}
                  ></i>
                </h1>
                {school?.length > 0 && (
                  <>
                    {iconBack ? (
                      <h4>
                        <i
                          className={`bi bi-arrow-left ${styles["icon-profile"]} cursor-pointer`}
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
        {educationToShow?.length > 0 &&
          educationToShow.map((education, index) => (
            <div key={education.id}>
              <div className="d-flex justify-content-center align-items-center">
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
                <div className="w-100 ms-3">
                  <div className="d-flex justify-content-between">
                    <p className="m-0 fw-600 font-xs">{education.name}</p>
                    <div className="d-flex ">
                      {iconEdit && (
                        <>
                          <i
                            className={`bi bi-pencil-fill me-1 ${styles["icon-profile"]} cursor-pointer`}
                            onClick={() => handleEditModal(education)}
                          ></i>
                          <i
                            className={`bi bi-trash3-fill ${styles["icon-profile"]} cursor-pointer`}
                            onClick={() => delEdu(education.id)}
                          ></i>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex">
                    <p className="m-0 font-xss lh-20">{education.degree}</p>
                    <p className="m-0 font-xss lh-20">,{education.major}</p>
                  </div>
                  <p className="m-0 font-xss lh-20 text-gray-follow">
                    {dayjs(education.startDate).format("YYYY")} -{" "}
                    {education.isGraduated
                      ? "Present"
                      : dayjs(education.endDate).format("YYYY")}
                  </p>
                  <p className="m-0 mt-2 font-xss lh-20 text-gray-follow">
                    {t("Activities and societies")} {education.description}
                  </p>
                </div>
              </div>
              {index < educationToShow?.length - 1 && (
                // <hr className="border-none mt-3 border-top-md" />
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
        {!showAllEducation && school?.length - educationToShow?.length > 0 && (
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
              onClick={() => setshowAllEducation(!showAllEducation)}
              className="border-none d-flex justify-content-center align-items-center bg-none cursor-pointer"
            >
              <p className="m-0 font-xss fw-600 me-1">
                {t("Show all")} {school?.length - educationToShow?.length}{" "}
                {t("educations")}
              </p>
              <i
                className={`bi bi-arrow-right ${styles["icon-profile"]} cursor-pointer`}
              ></i>
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
      {isLoading && <WaveLoader />}
    </>
  );
};

export default Education;
