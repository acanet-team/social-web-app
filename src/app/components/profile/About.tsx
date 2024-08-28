import React, {
  useCallback,
  useEffect,
  useState,
  type SetStateAction,
} from "react";
import { TruncateText } from "../TruncateText";
import styles from "@/styles/modules/profile.module.scss";
import Image from "next/image";
import type { BrokerProfile } from "@/api/profile/model";
import { useTranslations } from "next-intl";
import { throwToast } from "@/utils/throw-toast";
import { updateNewAbout } from "@/api/profile";

export const About = ({
  dataBrokerProfile,
  role,
}: {
  // setAboutText: React.Dispatch<React.SetStateAction<string>>;
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [show, setShow] = useState(false);
  const [aboutText, setAboutText] = useState("");

  useEffect(() => {
    setAboutText(dataBrokerProfile.about);
  }, []);

  const handleOpen = () => {
    setShow(true);
  };

  const submitAbout = async () => {
    if (aboutText.trim() === "") {
      throwToast("Please enter some text for your about", "error");
      return;
    }
    try {
      const newAbout = await updateNewAbout(aboutText);
      setShow(false);
      throwToast("About updated successfully", "success");
      // setAboutText("");
    } catch (error) {
      throwToast("Error updating", "error");
    }
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
          className="mb-4"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h2 className="m-0 fw-600">{t("about")}</h2>
          {role === true && (
            <h4>
              <i
                className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                onClick={() => handleOpen()}
              ></i>
            </h4>
          )}
        </div>
        <div>
          {!show ? (
            <TruncateText
              content={aboutText}
              wordLimit={150}
              className="m-0 font-xsss fw-400 lh-20"
            />
          ) : (
            <div>
              <div
                style={{
                  resize: "none",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  paddingRight: "0px",
                }}
              >
                <textarea
                  className="w-100 m-0 font-xsss fw-400 lh-20 theme-dark-bg d-flex"
                  onChange={(event) => {
                    setAboutText(event.target.value);
                  }}
                  rows={5}
                  value={aboutText}
                  maxLength={5000}
                  style={{
                    resize: "none",
                    border: "none",
                  }}
                  placeholder="Please write your description"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <button
                  className="px-4 py-1 bg-blue-button text-white font-xsss"
                  style={{ marginRight: "0px", border: "none" }}
                >
                  <p className="m-0" onClick={() => submitAbout()}>
                    Save
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
