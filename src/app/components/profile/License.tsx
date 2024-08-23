import { dataLicenseProfile } from "@/app/fakeData/profile";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import { FormatDate } from "../FormatDate";
import type { BrokerProfile } from "@/api/profile/model";
import { ModalLicense } from "./ModalLicense";

// const License = ({
//   dataBrokerProfile,
// }: {
//   dataBrokerProfile: BrokerProfile;
// }) => {
const License = ({ role }: { role: boolean }) => {
  const [showAllLicense, setshowAllLicense] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  const licenseToShow = showAllLicense
    ? dataLicenseProfile
    : dataLicenseProfile.slice(0, 2);

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
          <h2 className="m-0 fw-600 mb-4">License & Certification</h2>
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
        {licenseToShow.map((license, index) => (
          <>
            <div
              key={license.id_credential}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
              }}
            >
              <Image
                src={license.license_logo}
                width={48}
                height={48}
                alt={license.license_name}
                style={{
                  objectFit: "cover",
                }}
              />
              <div>
                <p className="m-0 fw-600 font-xss">{license.license_name}</p>
                <p className="m-0 font-xsss lh-20">
                  {license.issuing_organization}
                </p>
                <p className="m-0 font-xsss lh-20 text-gray-follow">
                  Issued {FormatDate(license.license_granted_date)} -{" "}
                  {license.license_expiry_date == null && "No expiration date"}
                </p>
                <p className="m-0 mt-2 font-xsss lh-20 text-gray-follow">
                  Credential {license.id_credential}
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
        {!showAllLicense &&
          dataLicenseProfile.length - licenseToShow.length > 0 && (
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
                  Show all {dataLicenseProfile.length - licenseToShow.length}{" "}
                  license & certification
                </p>

                <i
                  className={`bi bi-arrow-right ${styles["icon-profile"]}`}
                ></i>

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
