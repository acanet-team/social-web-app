import { dataLicenseProfile } from "@/app/fakeData/profile";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile } from "@/api/profile/model";
import { ModalLicense } from "./ModalLicense";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

const License = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [showAllLicense, setshowAllLicense] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [iconEdit, setShowIconEdit] = useState(false);
  const licenses = dataBrokerProfile.licenses ?? [];

  const licenseToShow = showAllLicense ? licenses : licenses.slice(0, 2);

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
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
          <h2 className="m-0 fw-600 mb-4">{t("license&certifications")}</h2>
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
                    onClick={() => handleOpenModal()}
                  ></i>
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
        {licenseToShow.map((license, index) => (
          <>
            <div
              key={license.id}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
              }}
            >
              {/* <Image
                src={license.license_logo}
                width={48}
                height={48}
                alt={license.licenseType}
                style={{
                  objectFit: "cover",
                }}
              /> */}
              <div>
                <p className="m-0 fw-600 font-xss">{license.licenseType}</p>
                <p className="m-0 font-xsss lh-20">{license.licenseIssuer}</p>
                <p className="m-0 font-xsss lh-20 text-gray-follow">
                  Issued {dayjs(license.licenseIssueDate).format("MMM-YYYY")} -{" "}
                  {license.licenseExpirationDate
                    ? dayjs(license.licenseExpirationDate).format("MMM-YYYY")
                    : "No expiration date"}
                </p>
                <p className="m-0 mt-2 font-xsss lh-20 text-gray-follow">
                  Credential {license.credentialID}
                </p>
              </div>
            </div>
            {index < licenseToShow.length - 1 && (
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
        {!showAllLicense && licenses.length - licenseToShow.length > 0 && (
          <>
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #d1d1d1",
                marginTop: "20px",
              }}
            />
            <button
              onClick={() => setshowAllLicense(!showAllLicense)}
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
                {dataBrokerProfile.licenses.length - licenseToShow.length}{" "}
                license & certification
              </p>

              <i className={`bi bi-arrow-right ${styles["icon-profile"]}`}></i>
            </button>
          </>
        )}
      </div>
      {show && (
        <ModalLicense
          handleClose={handleCancel}
          handleShow={handleOpenModal}
          title="License"
          show={show}
        />
      )}
    </>
  );
};

export default License;
