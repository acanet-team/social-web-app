import React, { useCallback, useEffect, useState } from "react";
import styles from "@/styles/modules/profile.module.scss";
import { ModalSocialMedia } from "./ModalSocialMedia";
import type { BrokerProfile } from "@/api/profile/model";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { v4 as uuidV4 } from "uuid";

const SocialMedia = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const socialNames = [
    "facebook",
    "twitter",
    "youtube",
    "github",
    "linkedin",
    "instagram",
    "skype",
    "google",
  ];
  const socialMedia = dataBrokerProfile.socialMedia ?? [];
  const t = useTranslations("MyProfile");
  const [show, setShow] = useState(false);
  const [social, setSocial] = useState<
    Record<string, { url: string; id: string }>
  >(
    socialNames.reduce(
      (acc, name) => {
        const existingMedia = socialMedia.find((item) => item.name === name);
        acc[name] = {
          url: existingMedia?.mediaUrl || "",
          id: existingMedia?.id || uuidV4(),
        };
        return acc;
      },
      {} as Record<string, { url: string; id: string }>,
    ),
  );

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const iconMap: Record<string, string> = {
    facebook: "bi-facebook",
    twitter: "bi-twitter-x",
    linkedIn: "bi-linkedin",
    instagram: "bi-instagram",
    github: "bi-github",
    google: "bi-google",
    skype: "bi-skype",
    youtube: "bi-youtube",
  };

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
          {role && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "4px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4>
                <i
                  className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                  onClick={handleOpenModal}
                ></i>
              </h4>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {socialMedia.map((item) =>
            item.mediaUrl ? (
              <div key={item.id}>
                <Link href={item.mediaUrl}>
                  <i className={`bi ${iconMap[item.name] || ""}`}></i>
                </Link>
              </div>
            ) : null,
          )}
        </div>
      </div>

      {show && (
        <ModalSocialMedia
          dataBrokerProfile={dataBrokerProfile}
          handleClose={handleCancel}
          title="Edit Social Media"
          show={show}
          social={social}
          setSocial={setSocial}
        />
      )}
    </>
  );
};

export default SocialMedia;
