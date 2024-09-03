import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { putSocialMedia } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import type { BrokerProfile } from "@/api/profile/model";
import { removePropertiesEmpty } from "@/utils/Helpers";
import { v4 as uuidV4 } from "uuid";
import WaveLoader from "../WaveLoader";

interface ModalSocialProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
  dataBrokerProfile: BrokerProfile;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalSocialMedia: React.FC<ModalSocialProp> = ({
  handleClose,
  show,
  title,
  dataBrokerProfile,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [social, setSocial] = useState<
    Record<string, { url: string; id: string }>
  >(
    socialNames.reduce(
      (acc, name) => ({ ...acc, [name]: { url: "", id: uuidV4() } }),
      {},
    ),
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSocial((prevSocial) => ({
        ...prevSocial,
        [name]: { url: value, id: uuidV4() },
      }));
    },
    [],
  );

  const submitSocial = useCallback(async () => {
    setIsLoading(true);
    try {
      await putSocialMedia(removePropertiesEmpty(social));
      throwToast("Social media updated successfully", "success");
      handleClose();
    } catch (error) {
      throwToast("An error occurred while updating social media", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
              {socialNames.map((name) => (
                <div key={name} style={{ flexBasis: "calc(50% - 20px)" }}>
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
                      placeholder=""
                      value={social[name]?.url}
                      onChange={handleInputChange}
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
            onClick={submitSocial}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
};
