import React, { useCallback, useEffect, useState } from "react";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile, SocialMedia } from "@/api/profile/model";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { v4 as uuidV4 } from "uuid";
import { ModalSocialMedia } from "@/components/profile/ModalSocialMedia";
export const defaultSocials: SocialMedia[] = [
  {
    name: "facebook",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "twitter",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "youtube",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "github",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "linkedin",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "instagram",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "skype",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
  {
    name: "google",
    mediaUrl: "",
    id: `${uuidV4()}`,
  },
];
const SocialMedia = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [show, setShow] = useState(false);

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (dataBrokerProfile?.socialMedia?.length === 0) {
      setSocials(defaultSocials);
    } else {
      setSocials(dataBrokerProfile?.socialMedia);
    }
  }, [dataBrokerProfile]);

  // console.log("aaaaa",socials);

  const iconMap: Record<string, string> = {
    facebook: "bi-facebook",
    twitter: "bi-twitter-x",
    linkedin: "bi-linkedin",
    instagram: "bi-instagram",
    github: "bi-github",
    google: "bi-google",
    skype: "bi-skype",
    youtube: "bi-youtube",
  };

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(async () => {
    setShow(false);
  }, []);
  return (
    <>
      <div
        className="card p-4 border-0 shadow-xss"
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
          <p className="m-0 mb-1 fw-700 font-xss">{t("socialMedia")}</p>
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
          {socials?.length > 0 ? (
            socials.map((item) =>
              item.mediaUrl ? (
                <div
                  key={item.id}
                  onClick={() => handleLinkClick(item.mediaUrl)}
                >
                  <i
                    className={`bi ${iconMap[item.name] || ""} text-black`}
                  ></i>
                </div>
              ) : null,
            )
          ) : (
            <></>
          )}
        </div>
      </div>

      {show && (
        <ModalSocialMedia
          dataBrokerProfile={dataBrokerProfile}
          handleClose={handleCancel}
          title="Edit Social Media"
          show={show}
          socials={socials}
          // setSocial={setSocial}
          setSocials={setSocials}
        />
      )}
    </>
  );
};

export default SocialMedia;
