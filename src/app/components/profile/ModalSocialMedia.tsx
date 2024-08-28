import React, { useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { BrokerProfile } from "@/api/profile/model";
import { throwToast } from "@/utils/throw-toast";
import { putSocialMedia } from "@/api/profile";
interface ModalSocialProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
  dataBrokerProfile: BrokerProfile;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
// interface ModalSocial {
//   name: string;
//   mediaUrl: string;
// }
export const ModalSocialMedia: React.FC<ModalSocialProp> = ({
  handleClose,
  handleShow,
  show,
  title,
  dataBrokerProfile,
  setShow,
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
  const [social, setSocial] = useState<Record<string, string>[]>([]);
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    if (window) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const inputChanged = (name: string, value: string) => {
  //   // setSocial((prev) => [
  //   //   ...new Set([...prev, { name: name, mediaUrl: value }]),
  //   // ]);
  //   setSocial(prev => [...prev, {`${name}`: value}]);
  // };

  // const submitSocial = () => {
  //   const hasUrlSocialArr: any = [];
  //   console.log("social", social);
  //   social.forEach((s) => {
  //     if (s.mediaUrl) {
  //       hasUrlSocialArr.push(s);
  //     }
  //   });
  //   // console.log('yyyy', hasUrlSocialArr);
  // };

  return (
    <>
      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className={`${styles["customModal"]} nunito-font`}
      >
        <Modal.Header
          closeButton={fullscreen === "sm-down" ? false : true}
          className={styles["modal-header"]}
        >
          {fullscreen && (
            <i
              className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
              onClick={handleClose}
            ></i>
          )}
          <Modal.Title>
            <h1 className="m-0 fw-bold">{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles["modal-content"]}>
          <form className="p-1">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {socialNames.map((name, index) => (
                <div key={index} style={{ flexBasis: "calc(50% - 20px)" }}>
                  <div style={{ width: "100%" }}>
                    <p className="m-0 py-1 fw-600 font-xss">{name}</p>
                    <input
                      className="px-2"
                      style={{
                        width: "100%",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        height: "32px",
                      }}
                      name={name}
                      // value={}
                      // onChange={(e) => {
                      //   inputChanged(name, e.target.value);
                      // }}
                      placeholder=""
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            // onClick={() => {
            //   submitSocial();
            // }}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
