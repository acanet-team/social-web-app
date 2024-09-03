import React, { useCallback, useState } from "react";
import styles from "@/styles/modules/profile.module.scss";
import Image from "next/image";
import { ModalSocialMedia } from "./ModalSocialMedia";
import type { BrokerProfile } from "@/api/profile/model";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SocialMedia = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const socialMedia = dataBrokerProfile.socialMedia ?? [];
  const t = useTranslations("MyProfile");
  const [show, setShow] = useState(false);

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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="m-0 mb-1 fw-700 font-xssss">{t("socialMedia")}</p>
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
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                    onClick={() => handleOpenModal()}
                  ></i>
                </h4>
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {socialMedia.map((socialMedia) => (
            <div key={socialMedia.id}>
              {socialMedia.mediaUrl && (
                <>
                  <Link href={socialMedia.mediaUrl}>
                    {socialMedia.name === "Facebook" ? (
                      <i className="bi bi-facebook"></i>
                    ) : socialMedia.name === "Twitter" ? (
                      <i className="bi bi-twitter-x"></i>
                    ) : socialMedia.name === "LinkedIn" ? (
                      <i className="bi bi-linkedin"></i>
                    ) : socialMedia.name === "Instagram" ? (
                      <i className="bi bi-instagram"></i>
                    ) : socialMedia.name === "Github" ? (
                      <i className="bi bi-github"></i>
                    ) : socialMedia.name === "Google" ? (
                      <i className="bi bi-google"></i>
                    ) : socialMedia.name === "Skype" ? (
                      <i className="bi bi-skype"></i>
                    ) : socialMedia.name === "Youtube" ? (
                      <i className="bi bi-youtube"></i>
                    ) : (
                      ""
                    )}
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {show && (
        <ModalSocialMedia
          dataBrokerProfile={dataBrokerProfile}
          handleClose={handleCancel}
          handleShow={handleOpenModal}
          title="Education"
          show={show}
          setShow={setShow}
        />
      )}
    </>
  );
};

export default SocialMedia;
