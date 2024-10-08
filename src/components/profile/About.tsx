import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/profile.module.scss";
import type { BrokerProfile } from "@/api/profile/model";
import { useTranslations } from "next-intl";
import { throwToast } from "@/utils/throw-toast";
import { updateProfile } from "@/api/profile";
import CircleLoader from "../CircleLoader";

export const About = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [show, setShow] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setAboutText(dataBrokerProfile?.about);
  }, [dataBrokerProfile]);

  const handleOpen = () => {
    setShow(!show);
  };

  const submitAbout = async () => {
    if (aboutText.trim() === "") {
      throwToast("Please enter some text for your about", "error");
      return;
    }
    setIsLoading(true);
    try {
      const newAboutFormDt = new FormData();
      if (aboutText) {
        const brokerProfies = {
          about: aboutText,
        };
        newAboutFormDt.append("brokerProfile", JSON.stringify(brokerProfies));
      }
      await updateProfile(newAboutFormDt);
      setShow(false);
      throwToast("About updated successfully", "success");
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isLoading && (
        <div className="card border-0 shadow-xss bg-white rounded-3 p-4 mt_2">
          <div className="mb-4 d-flex justify-content-between algin-items-center">
            <h2 className="m-0 fw-600">{t("About")}</h2>
            {role === true && (
              <h4>
                <i
                  className={`bi bi-pencil-fill ${styles["icon-profile"]} cursor-pointer`}
                  onClick={() => handleOpen()}
                ></i>
              </h4>
            )}
          </div>
          <div>
            {!show ? (
              <>
                <p className="fw-400 font-xss">
                  {expandPost
                    ? aboutText
                    : aboutText?.length > 150
                      ? aboutText?.substring(0, 150) + "..."
                      : aboutText}
                  {aboutText?.length > 150 && !expandPost ? (
                    <span
                      className={"cursor-pointer text-blue"}
                      onClick={() => setExpandPost((open) => !open)}
                    >
                      {t("See more")}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </>
            ) : (
              <div>
                <div style={{}}>
                  <textarea
                    className="w-100 m-0 font-xss fw-400 lh-20 d-flex border-ddd rounded-3"
                    onChange={(event) => {
                      setAboutText(event.target.value);
                    }}
                    rows={5}
                    value={aboutText}
                    maxLength={5000}
                    style={{
                      resize: "none",
                      paddingTop: "5px",
                      paddingLeft: "5px",
                      paddingRight: "0px",
                    }}
                    placeholder="Please write your description"
                  />
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="px-4 py-1 bg-blue-button text-white font-xss me-0 rounded-3 border-none">
                    <p className="m-0" onClick={() => submitAbout()}>
                      {t("save")}
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isLoading && <CircleLoader />}
    </>
  );
};
